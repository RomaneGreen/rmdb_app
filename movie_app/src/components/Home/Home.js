import React, { Component } from 'react'
import HeroImage from '../elements/HeroImage/HeroImage'
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import Spinner from '../elements/Spinner/Spinner';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn'
import   {API_KEY, API_URL, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE} from '../../config.js'


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
    if(localStorage.getItem('HomeState')) {

        const state = JSON.parse(localStorage.getItem('HomeState'))
        this.setState({...state})
    }else {
    this.setState({ loading: true});
    const endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    this.fetchItems(endPoint)
  }
  }
  loadMoreItems = () => {
    let endPoint = '';
    this.setState({ loading: true })
    if (this.state.searchTerm === '') {

      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;

    } else {

      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
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
      },() => {

        localStorage.setItem('HomeState', JSON.stringify(this.state));
      })
    })
    .catch( error => console.error('Error:', error))
  }


  searchItems = (searchTerm) => {

    let endPoint = ''
    this.setState({
      movies: [],
      loading: true,
      searchTerm
    })

    if ( searchTerm === '') {

      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    }else {
      endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
    }
    this.fetchItems(endPoint)
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
        <SearchBar callback={this.searchItems}/>
        </div> : null }
        <div className='rmdb-home-grid'>
        <FourColGrid 
        header={this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
        loading={this.state.loading}>
          {this.state.movies.map((element,i) => {
            return <MovieThumb
                key={i}
                clickable={true}
                image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`: './images/no_image.jpg'}
                movieId={element.id}
                movieName={element.original_title}
                />
          })}
        </FourColGrid>
        {this.state.loading ? <Spinner /> : null}
        {(this.state.currentPage <= this.state.totalPages && !this.state.loading ) ? 
         <LoadMoreBtn text="Load More" onClick={this.loadMoreItems}/> : null }
        </div>
        
      </div>
    )
  }
}
