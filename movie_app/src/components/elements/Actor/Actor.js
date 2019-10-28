import React from 'react';
import { IMG_BASE_URL , POSTER_SIZE, BACKDROP_SIZE } from '../../../config';
import './Actor.css'
import { IMAGE_BASE_URL } from '../../../../../Steps/Steps/Start of video 12/src/config';




const Actor = (props) => {

  const POSTER_SIZE = "w154"

  return (
    <div className="rmdb-actor">
      <img src={props.actor.profile_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${props.actor.profile_path}`
      alt="actorthumb" />
      <span className="rmdb-actor-name">{props.actor.name}</span>
      <span className="rmdb-actor-character">{props.actor.character}</span>
    </div>
  )
}

export default Actor
