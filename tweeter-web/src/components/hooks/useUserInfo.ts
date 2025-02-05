import { useContext } from 'react';
import { UserInfoContext } from '../userInfo/UserInfoProvider';
import { User, AuthToken } from 'tweeter-shared';

const useUserInfo = () => {
    const context = useContext(UserInfoContext);

    if (!context) {
        throw new Error('useUserInfo must be used within a UserInfoProvider');
    }

    const {
        currentUser,
        displayedUser,
        authToken,
        updateUserInfo,
        clearUserInfo,
        setDisplayedUser
    } = context;

    return {
        currentUser,
        displayedUser,
        authToken,
        updateUserInfo,
        clearUserInfo,
        setDisplayedUser
    };
};

export default useUserInfo;