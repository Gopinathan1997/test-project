import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'

import Header from '../Header'
import SearchContext from '../../context/SearchContext'
import './index.css'

class Search extends Component {
  renderNoSearch = () => (
    <div className="fail-cont">
      <img
        src="https://iili.io/Jg6Km41.png"
        className="search-img text-center"
        alt="search not found"
      />
      <h1 className="search-not-found">Search Not Found</h1>
      <p className="search-para">Try different keyword or search again</p>
    </div>
  )

  render() {
    return (
      <SearchContext.Consumer>
        {value => {
          const {
            searchList,
            initiateSearchPostLikeApi,
            retrySearch,
            searchInput,
            searchResult,
          } = value

          const renderFailureView = () => (
            <div className="fail-cont">
              <img
                className="failure_img"
                src="https://res.cloudinary.com/dziwdneks/image/upload/v1675775097/alert-triangle_cyhzqu.png"
                alt="failure view"
              />
              <p className="failure_heading">
                Something went wrong. Please try again
              </p>
              <button
                onClick={() => retrySearch(searchInput)}
                type="submit"
                className="failure-button btn btn-primary"
              >
                Try again
              </button>
            </div>
          )

          return (
            <div className="search-cont ">
              <Header />
              {searchResult === 'IN_PROGRESS' ? (
                <div className="loader-container" testid="loader">
                  <Loader
                    type="TailSpin"
                    color="#4094EF"
                    height={50}
                    width={50}
                  />
                </div>
              ) : searchResult === 'FAILURE' ? (
                renderFailureView()
              ) : searchResult === 'SUCCESS' && searchList.total > 0 ? (
                <div className="search-results bg-blue">
                  <h1>Search Results</h1>
                  <ul className="search-cont">
                    {searchList.posts.map(each => (
                      <li key={each.postId} className="posts-container">
                        <div className="d-flex align-center">
                          <img
                            src={each.profilePic}
                            alt="post author profile"
                            className="post-user-dp"
                          />
                          <Link
                            to={`/users/${each.userId}`}
                            className="post-user-detail"
                          >
                            <p className="post-username">{each.userName}</p>
                          </Link>
                        </div>
                        <img
                          src={each.postDetails.imageUrl}
                          alt="post"
                          className="post-image"
                        />
                        <div className="padding">
                          <div className="d-flex icon-container">
                            {each.likeStatus ? (
                              <button
                                aria-label="button"
                                className="btn"
                                testid="unLikeIcon"
                                onClick={() =>
                                  initiateSearchPostLikeApi(each.postId, false)
                                }
                              >
                                <FcLike
                                  size={24}
                                  testid="like icon"
                                  className="icon"
                                />
                              </button>
                            ) : (
                              <button
                                testid="likeIcon"
                                className="btn"
                                aria-label="button"
                                onClick={() =>
                                  initiateSearchPostLikeApi(each.postId, true)
                                }
                              >
                                <BsHeart
                                  size={24}
                                  testid="unlike icon"
                                  className="icon"
                                />
                              </button>
                            )}
                            <button
                              data-testid="comment icon"
                              aria-label="button"
                              className="btn"
                            >
                              <FaRegComment size={24} className="icon" />
                            </button>
                            <button
                              data-testid="share icon"
                              aria-label="button"
                              className="btn"
                            >
                              <BiShareAlt size={24} className="icon" />
                            </button>
                          </div>
                          <p className="like">{each.likesCount} likes</p>
                          <p>{each.postDetails.caption}</p>
                          <ul className="render-comments">
                            {each.comments.map(each => (
                              <li
                                className="comment-container"
                                key={each.user_id}
                              >
                                <p className="like">
                                  <span>{each.userName}</span>
                                  {each.comment}
                                </p>
                              </li>
                            ))}
                          </ul>
                          <p className="created">{each.createdAt}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                this.renderNoSearch()
              )}
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}
export default Search
