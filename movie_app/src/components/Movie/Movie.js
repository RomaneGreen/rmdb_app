import React, { Component } from 'react'
import { API_URL, API_KEY } from '../../config'
import MovieInfo from '../elements/MovieInfo/MovieInfo'
import Navigation from '../elements/Navigation/Navigation'
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar'
import FourColGrid from '../elements/Actor/Actor'
import Spinner from '../elements/Spinner/Spinner'
import './Movie.css'


export default class Movie extends Component {

  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  }

  componentDidMount() {
    this.setState({ loading: true })
    // First fetch movie 
    const endPoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-us`

    this.fetchItems(endPoint)
  }

  fetchItems = (endPoint) => {
    fetch(endPoint)
    .then(result => result.json())
    .then( result => {
        console.log(result)
      if(result.status_code) {
        this.setState({ loading: false });
      } else {
        this.setState({ movie: result}, () => {
          // ...then fetch actors in setstate callback function
          const endPoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`
          fetch(endPoint)
          .then(result => result.json())
          .then(result => {
            const directors = result.crew.filter((member) => member.job === "Director")
            this.setState({ actors: result.cast,
              directors : directors,
              loading: false
            })
          })
        })
      
      }
    }).catch( err => console.error('Error'))
  }

  render() {
    return (
      <div className="rmdb-movie">
        {this.state.movie ? 
        <div>
          <Navigation movie={this.props.location.movieName} />
          <MovieInfo movie={this.state.movie} />
          


        </div>
        }
         <MovieInfoBar />
      
        <Spinner />
      </div>
    )
  }
}
