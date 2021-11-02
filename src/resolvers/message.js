import { ForbiddenError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    // messages: async (parent, args, { models }) => {
    //   return await models.Message.findAll();
    // },
    messages: async (
      parent,
      { offset = 0, limit = 100 },
      { models },
    ) => {
      return await models.Message.findAll({
        offset,
        limit,
      });
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },
 
  Mutation: {
    // createMessage: async (parent, { text }, { me, models }) => {
    //   try {
    //     if (!me) {
    //       throw new ForbiddenError('Not authenticated as user.');
    //     }
    //     return await models.Message.create({
    //       text,
    //       userId: me.id,
    //     });
    //   } catch (error) {
    //     throw new Error(error);
    //     // throw new Error('My error message.');
    //   }
    // },

    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, me }) => {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      },
    ),
 
    // deleteMessage: async (parent, { id }, { models }) => {
    //   return await models.Message.destroy({ where: { id } });
    // },

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      },
    ),
  },
 
  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};