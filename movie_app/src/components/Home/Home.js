import React, { Component } from 'react'
import HeroImage from '../elements/HeroImage/HeroImage'
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import Spinner from '../elements/Spinner/Spinner';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn'
import   {API_KEY, API_URL, IMAGE_BASE_URL, BACKDROP_SIZE} from '../../config.js'


import './Home.css'

export default class Home extends Component {

  state = {
    movies: [],
    loading: false,
    heroImage: null,
    currentPages: 0,
    totalPages: 0,
    searchTerm: ''

  }

  componentDidMount() {
    this.setState({ loading: true});
    const endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    this.fetchItems(endPoint)
  }

  loadMoreItems = () => {
    let endPoint = '';
    this.setState({ loading: true })
    if (this.state.searchTerm === '') {

      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;

    } else {

      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&query${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
    }
    this.fetchItems(endPoint)
  }

  fetchItems = (endPoint) => {
    fetch(endPoint)
    .then(result => result.json())
    .then( result => {
      this.setState({ 
        movies: [...this.state.movies,...result.results],
        heroImage: this.state.heroImage || result.results[0],
        loading: false,
        currentPage: result.page,
        totalPages: result.total_pages
      })
    })
  }
  render() {
    return (
      <div className = "rmdb-home">
        {this.state.heroImage ? 
        <div>
        <HeroImage
         image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
         title={this.state.heroImage.original_title}
         text={this.state.heroImage.overview}
          />
        <SearchBar />
        </div> : null }
        <FourColGrid />
        <Spinner />
        <LoadMoreBtn />
      </div>
    )
  }
}
