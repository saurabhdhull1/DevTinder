<!-- Dev tinder APIs -->

authRouter
- Post /signup
- Post /login
- Post /logout

profileRouter
- Get /profile/view
- Post /profile/edit
- Post /profile/password
- Post /profile/delete

connectionRouter
- Post /request/send/interested/:userId
- Post /request/send/ignored/:userId
- Post /request/send/accepted/:userId
- Post /request/send/rejected/:userId

userRouter
- Get /user/connections
- Post /user/request
- Post /user/feed