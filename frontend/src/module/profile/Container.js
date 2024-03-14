import _ from 'lodash'
import { message } from 'antd'
import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'

export default createContainer(Component, (state, ownProps) => {
  return {
    is_admin: state.user.is_admin,
    is_login: state.user.is_login,
    publicKey: state.user.publicKey,
    currentUserId: _.get(ownProps, 'user._id', state.user.current_user_id),
    wallets: state.user.wallets,
    username: state.user.username,
    expiredTime: state.user.expiredTime,
    clientCount: state.user.clientCount,
    clientLimit: state.user.clientLimit
  }
}, (dispatch, ownProps) => {
  const userService = new UserService()

  return {
    async getCurrentUser() {
      const userId = _.get(ownProps, 'user._id')
      try {
        if (userId) {
          await userService.getMember(userId)
        } else {
          await userService.getCurrentUser()
        }
      } catch (err) {
        message.error(err.message)
      }
    },

    async setStatus(publicKey, address) {
      return await userService.setStatus(publicKey, address)
    },

    async updateUser(userId, data) {
      await userService.update(userId, data)
    },
    changePassword() {
      userService.path.push('/change-password')
    }
  }
})
