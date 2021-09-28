export const MiniatureGameErrors = {
  Game: {
    NotFound: {
      code: 'GAME_NOT_FOUND',
      message: 'Lead not found.',
    },
    Exists: {
      code: 'GAME_ALREADY_EXISTS',
      message: 'Game already exists.',
    },
  },
  Publisher: {
    NotFound: {
      code: 'PUBLISHER_NOT_FOUND',
      message: 'Publisher not found.',
    },
    Exists: {
      code: 'PUBLISHER_ALREADY_EXISTS',
      message: 'Publisher already exists.',
    },
  },
  Common: {
    NotAllowed: {
      code: 'ACTION_NOT_PERMITTED',
      message: 'This action is not permitted to current user.',
    },
    NotImplemented: {
      code: 'NOT_IMPLEMENTED',
      message: 'Method not implemented.',
    },
  },
};
