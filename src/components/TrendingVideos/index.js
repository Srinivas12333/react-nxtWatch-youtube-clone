import {Component} from 'react'
import Cookies from 'js-cookie'
import {HiFire} from 'react-icons/hi'
import Loader from 'react-loader-spinner'

import ThemeAndVideoContext from '../../context/ThemeAndVideoContext'
import NavigationBar from '../NavigationBar'
import Header from '../Header'
import TrendingVideoCard from '../TrendingVideoCard'
import FailureView from '../FailureView'

import {
  TrendingContainer,
  TrendingVideoTitle,
  TitleIconContainer,
  TrendingText,
  TrendingVideoList,
  LoaderContainer,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TrendingVideos extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    trendingVideos: [],
  }

  componentDidMount() {
    this.getVideos()
  }

  getVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/trending'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.videos.map(eachVideo => ({
        id: eachVideo.id,
        publishedAt: eachVideo.published_at,
        thumbnailUrl: eachVideo.thumbnail_url,
        title: eachVideo.title,
        viewCount: eachVideo.view_count,
        name: eachVideo.channel.name,
        profileImageUrl: eachVideo.channel.profile_image_url,
      }))
      this.setState({
        trendingVideos: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVideosView = () => {
    const {trendingVideos} = this.state

    return (
      <TrendingVideoList>
        {trendingVideos.map(eachVideo => (
          <TrendingVideoCard key={eachVideo.id} videoDetails={eachVideo} />
        ))}
      </TrendingVideoList>
    )
  }

  renderLoadingView = () => (
    <LoaderContainer>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </LoaderContainer>
  )

  onRetry = () => {
    this.getVideos()
  }

  renderFailureView = () => <FailureView onRetry={this.onRetry} />

  renderTrendingVideos = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideosView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <ThemeAndVideoContext.Consumer>
        {value => {
          const {isDarkTheme} = value

          const bgColor = isDarkTheme ? '#0f0f0f' : '#f9f9f9'
          const textColor = isDarkTheme ? '#f9f9f9' : '#231f20'

          return (
            <div data-testid="trending">
              <Header />
              <NavigationBar />
              <TrendingContainer data-testid="trending" bgColor={bgColor}>
                <TrendingVideoTitle>
                  <TitleIconContainer>
                    <HiFire size={35} color="#ff0000" />
                  </TitleIconContainer>
                  <TrendingText color={textColor}>Trending</TrendingText>
                </TrendingVideoTitle>
                {this.renderTrendingVideos()}
              </TrendingContainer>
            </div>
          )
        }}
      </ThemeAndVideoContext.Consumer>
    )
  }
}
export default TrendingVideos
