import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import {
  LoginFormContainer,
  FormContainer,
  LoginWebsiteLogo,
  InputContainer,
  InputLabel,
  InputField,
  LoginButton,
  ErrorMessage,
  ShowHideContainer,
  CheckBoxInput,
} from './styledComponents'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    isCheckedPassword: false,
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onShowHidePassword = () => {
    this.setState(prevState => ({
      isCheckedPassword: !prevState.isCheckedPassword,
    }))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <InputLabel htmlFor="username">USERNAME</InputLabel>
        <InputField
          type="text"
          id="username"
          value={username}
          placeholder="Username"
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password, isCheckedPassword} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <>
        <InputLabel htmlFor="password">PASSWORD</InputLabel>
        <InputField
          type={isCheckedPassword ? 'text' : 'password'}
          id="password"
          value={password}
          placeholder="Username"
          onChange={this.onChangePassword}
        />
        <ShowHideContainer>
          <CheckBoxInput
            type="checkbox"
            id="show-password"
            checked={isCheckedPassword}
            onChange={this.onShowHidePassword}
          />
          <InputLabel htmlFor="show-password">Show Password</InputLabel>
        </ShowHideContainer>
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <LoginFormContainer>
        <FormContainer onSubmit={this.onSubmitForm}>
          <LoginWebsiteLogo
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
          />
          <InputContainer>{this.renderUsernameField()}</InputContainer>
          <InputContainer>{this.renderPasswordField()}</InputContainer>
          <LoginButton type="submit">Login</LoginButton>
          {showSubmitError && <ErrorMessage>*{errorMsg}</ErrorMessage>}
        </FormContainer>
      </LoginFormContainer>
    )
  }
}
export default LoginForm
