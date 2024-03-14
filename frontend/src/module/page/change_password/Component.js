import React from 'react';
import StandardPage from '../StandardPage';
import ChangePasswordForm from '@/module/form/ChangePasswordForm/Container';
import I18N from '@/I18N'

import './style.scss'

export default class extends StandardPage {

    ord_renderContent() {
        return (
            <div className="p_forgotPassword ebp-wrap">
                <div className="d_box">
                    <p>
                        Change Password
                    </p>
                    <ChangePasswordForm />
                </div>
            </div>
        );
    }
}
