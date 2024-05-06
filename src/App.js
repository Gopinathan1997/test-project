import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import UserProfile from './components/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import Search from './components/Search'
import PageNotFound from './components/PageNotFound'

import SearchContext from './context/SearchContext'

class App extends Component {
  state = {searchList: [], searchResult: 'INITIAL'}

  upadtePosttoSearch = data => this.setState({searchList: data})

  getSearchData = async searchInput => {
    this.setState({searchResult: 'IN_PROGRESS'})
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const postsData = await response.json()
      const formattedPostsData = {
        total: postsData.total,
        posts: postsData.posts.map(each => ({
          createdAt: each.created_at,
          likesCount: each.likes_count,
          postId: each.post_id,
          profilePic: each.profile_pic,
          userId: each.user_id,
          userName: each.user_name,
          comments: each.comments.map(eachComment => ({
            comment: eachComment.comment,
            userId: eachComment.user_id,
            userName: eachComment.user_name,
          })),
          postDetails: {
            caption: each.post_details.caption,
            imageUrl: each.post_details.image_url,
          },
        })),
      }
      this.setState({
        searchList: formattedPostsData,
        searchResult: 'SUCCESS',
      })
    } else {
      this.setState({searchResult: 'FAILURE'})
    }
  }

  initiateSearchPostLikeApi = async (postId, likeStatus) => {
    const {searchList} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const likeDetails = {
      like_status: likeStatus,
    }
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likeDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    let userPostsData = searchList
    console.log(searchList.posts)
    userPostsData = userPostsData.posts.map(eachObject => {
      if (eachObject.postId === postId && likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount + 1,
          likeStatus: true,
        }
      }
      if (eachObject.postId === postId && !likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount - 1,
          likeStatus: false,
        }
      }

      return eachObject
    })
    const actualData = {
      posts: userPostsData,
      total: userPostsData.length,
    }
    this.setState({searchList: actualData})
  }

  render() {
    const {searchList, searchResult} = this.state
    return (
      <SearchContext.Provider
        value={{
          searchList,
          retrySearch: this.getSearchData,
          searchResult,
          getSearchData: this.getSearchData,
          initiateSearchPostLikeApi: this.initiateSearchPostLikeApi,
          upadtePosttoSearch: this.upadtePosttoSearch,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={Profile} />
          <ProtectedRoute exact path="/users/:userId" component={UserProfile} />
          <ProtectedRoute exact path="/search" component={Search} />
          <Route path="/not-found" component={PageNotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
