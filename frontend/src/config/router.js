import HomePage from '@/module/page/_numbers/home/Container'
import AddClientPage from '@/module/page/_numbers/add_client/Container'
import UpdateClientPage from '@/module/page/_numbers/update_client/Container'

import DicePage from '@/module/page/_games/dice/Container'
import LuckyNumberPage from '@/module/page/_games/luckyNumber/Container'
import TestBtcPage from '@/module/page/test_btc/Container'
import PaymentPage from '@/module/page/payment/Container'
import PaymentCreatePage from '@/module/page/paymentCreate/Container'

import LoginPage from '@/module/page/login/Container'
import RegisterPage from '@/module/page/register/Container'
import ForgotPasswordPage from '@/module/page/forgot_password/Container'
import ChangePasswordPage from '@/module/page/change_password/Container'
import ResetPasswordPage from '@/module/page/reset_password/Container'
import ProfileInfoPage from '@/module/page/profile/info/Container'

import BanlancePage from '@/module/page/profile/balance/Container'
import DepositPage from '@/module/page/profile/deposit/Container'
import WithdrawPage from '@/module/page/profile/withdraw/Container'
// admin pages
import AdminUsersPage from '@/module/page/admin/users/Container'
import AdminChainsPage from '@/module/page/admin/chain/Container'
import AdminDetailChainPage from '@/module/page/admin/chain/Detail/Container'
import AdminProfileDetailPage from '@/module/page/admin/profile_detail/Container'
import NotFound from '@/module/page/error/NotFound'

export default [
    {
        path: '/home',
        page: HomePage
    },
    {
        path: '/add_client',
        page: AddClientPage
    },
    {
        path: '/update_client',
        page: UpdateClientPage
    },


    {
        path: '/',
        page: HomePage
    },
    {
        path: '/luckyNumber',
        page: LuckyNumberPage
    },
    {
        path: '/dice',
        page: DicePage
    },
    {
        path: '/test',
        page: TestBtcPage
    },
    {
        path: '/payment/create',
        page: PaymentPage
    },
    {
        path: '/payment/:paymentId',
        page: PaymentPage
    },

    /*
    ********************************************************************************
    * Login/Register
    ********************************************************************************
      */
    {
        path: '/login',
        page: LoginPage
    },
    {
        path: '/register',
        page: RegisterPage
    },
    {
        path: '/forgot-password',
        page: ForgotPasswordPage
    },
    {
        path: '/change-password',
        page: ChangePasswordPage
    },
    {
        path: '/reset-password',
        page: ResetPasswordPage
    },
    /*
    ********************************************************************************
    * Profile page
    ********************************************************************************
      */
    {
        path: '/profile/info',
        page: ProfileInfoPage
    },
    {
        path: '/profile/balance',
        page: BanlancePage
    },
    {
        path: '/profile/deposit',
        page: DepositPage
    },
    {
        path: '/profile/withdraw',
        page: WithdrawPage
    },
    {
        path: '/admin/profile/:userId',
        page: AdminProfileDetailPage
    },
    /*
    ********************************************************************************
    * Admin
    ********************************************************************************
      */
    {
        path: '/admin/users',
        page: AdminUsersPage
    },
    {
        path: '/admin/chains',
        page: AdminChainsPage
    },
    {
        path: '/admin/chain_create',
        page: AdminDetailChainPage
    },
    {
        path: '/admin/chains/:chainId',
        page: AdminDetailChainPage
    },

    // Other
    {
        page: NotFound
    }
]
