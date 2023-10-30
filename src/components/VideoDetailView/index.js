import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ThemeAndVideoContext from '../../context/ThemeAndVideoContext'
import NavigationBar from '../NavigationBar'
import Header from '../Header'
import FailureView from '../FailureView'
import PlayVideoView from '../PlayVideoView'

import {VideoDetailsContainer, LoaderContainer} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoDetailView extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    videoDetails: [],
    isLiked: false,
    isDisLiked: false,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  formattedData = data => ({
    id: data.video_details.id,
    title: data.video_details.title,
    videoUrl: data.video_details.video_url,
    thumbnailUrl: data.video_details.thumbnail_url,
    publishedAt: data.video_details.published_at,
    description: data.video_details.description,
    viewCount: data.video_details.view_count,
    name: data.video_details.channel.name,
    profileImageUrl: data.video_details.channel.profile_image_url,
    subscriberCount: data.video_details.channel.subscriber_count,
  })

  getVideoDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/videos/${id}`
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
      const updatedData = this.formattedData(data)
      this.setState({
        videoDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  clickLiked = () => {
    this.setState(prevState => ({
      isLiked: !prevState.isLiked,
      isDisLiked: false,
    }))
  }

  clickDisLiked = () => {
    this.setState(prevState => ({
      isDisLiked: !prevState.isDisLiked,
      isLiked: false,
    }))
  }

  renderLoadingView = () => (
    <LoaderContainer data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </LoaderContainer>
  )

  renderPlayVideoView = () => {
    const {videoDetails, isLiked, isDisLiked} = this.state

    return (
      <PlayVideoView
        videoDetails={videoDetails}
        isLiked={isLiked}
        isDisLiked={isDisLiked}
        clickLiked={this.clickLiked}
        clickDisLiked={this.clickDisLiked}
      />
    )
  }

  renderFailureView = () => <FailureView onRetry={this.onRetry} />

  renderVideoDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPlayVideoView()
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

          return (
            <>
              <Header />
              <NavigationBar />
              <VideoDetailsContainer
                data-testid="videoItemDetails"
                bgColor={bgColor}
              >
                {this.renderVideoDetailsView()}
              </VideoDetailsContainer>
            </>
          )
        }}
      </ThemeAndVideoContext.Consumer>
    )
  }
}

export default VideoDetailView
