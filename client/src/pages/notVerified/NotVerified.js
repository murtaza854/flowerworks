import React, { useEffect } from 'react';
// import api from '../../api';
// import UserContext from '../../authenticatedUser';

function NotVerified(props) {
    // const user = useContext(UserContext);
    useEffect(() => {
        (
          async () => {
            // await fetch(`${api}/users/logout`, {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     credentials: 'include',
            //     withCredentials: true,
            //   });
            //   user.setUserState(null);
          })();
      }, []);
    return (
        <div>
            Email not Verified! You have been Logged out.
        </div>
    );
}

export default NotVerified;