import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut} from '../actions';

class GoogleAuth extends React.Component {
   componentDidMount() {
      window.gapi.load('client:auth2', () => {
         window.gapi.client.init({
            clientId: '352219647828-flgemju4kbrnnh9icl5vgi7q27rlvjca.apps.googleusercontent.com',
            scope: 'email'
         }).then(() => {
            this.auth = window.gapi.auth2.getAuthInstance()
            this.onAuthChange(this.auth.isSignedIn.get())
            this.auth.isSignedIn.listen(this.onAuthChange)
         })
      });
   }

   // ------ this.auth = the window.gapi.auth2.getAuthInstance() ------------

   onAuthChange = (isSignedIn) => {
      if (isSignedIn === true) {
         this.props.signIn(this.auth.currentUser.get().getId());
      } else {
         this.props.signOut();
      }
   };

   onSignInClick = () => {
      this.auth.signIn();
   };

   onSignOutClick = () => {
      this.auth.signOut()
   }

   // _________ this.props = the stored state in reducers, passed to GoogleAuth class _______

   renderAuthButton() {
      if (this.props.isSignedIn === null) {
         return null
      } else if (this.props.isSignedIn === true) {
         return (
            <button onClick={this.onSignOutClick} className="ui red google button">
               <i className="google icon" />
               Sign Out
            </button>
         )
      } else {
         return (
            <button onClick={this.onSignInClick} className="ui red google button">
               <i className="google icon" />
               Sign In with Google
            </button>
         )
      }
   }

   render() {
      return (
         <div>{this.renderAuthButton()}</div>
      )
   }
}

const mapStateToProps = (state) => {
   return { isSignedIn: state.auth.isSignedIn, userId: state.auth.userId }
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);