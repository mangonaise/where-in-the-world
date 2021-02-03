import React, { memo, useContext } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { PatternLines } from '@vx/pattern';
import { observer } from 'mobx-react-lite';
import { GameContext } from '../App';
import '../styles/Map.css';
const mapData = require('../assets/topo.json');

interface Props {
  setTooltip: (content: string) => void,
  setAnswerSelectorPos: (coords: [number, number]) => void
}

const Map: React.FC<Props> = ({ setTooltip, setAnswerSelectorPos }) => {
  const game = useContext(GameContext);
  const activeCountryId = game.activeCountryId;
  const answerOptions = game.answerOptions;

  function handleClickCountry(e: React.MouseEvent, countryName: string, countryId: number) {
    e.stopPropagation();
    if (game.answerOptions.includes(countryName)) {
      setAnswerSelectorPos([e.clientX, e.clientY]);
      game.setActiveCountryId(countryId);
    }
    setTooltip('');
  }

  return (
    <>
      <div id="map-container">
        <ComposableMap id="main-map" data-tip="" onMouseEnter={() => game.setActiveCountryId(-1)}>
          {/* <PatternLines
            id="answerOption" height={4} width={4} stroke="#776865" strokeWidth={0.5}
            background="orange" orientation={["diagonal"]}
          /> */}
          <PatternLines
            id="answered" height={4} width={4} stroke="#776865" strokeWidth={0.5}
            background="skyblue" orientation={["diagonal"]}
          />
          <ZoomableGroup>
            <Geographies geography={mapData}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const countryId = parseInt(geo.rsmKey.split('-')[1]);
                  const countryName = game.getCountryNameById(countryId);
                  const userGuess = game.getUserGuessByCountryId(countryId);
                  const isCompleted = game.completedCountries.includes(countryName);
                  const isAnswerOption = answerOptions.includes(countryName);
                  return (<Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className={`
                      geography 
                      ${isAnswerOption && (!!userGuess ? 'country-answered' : 'country-answer-option')} 
                      ${isCompleted && 'country-completed'} 
                      ${activeCountryId === countryId && 'country-active'}
                    `}
                    fill={isAnswerOption ? 
                      (!!userGuess ? 'url(#answered)' : 'orange') 
                      : 'rgb(225, 225, 225)'
                    }
                    onClick={(e) => handleClickCountry(e, countryName, countryId)}
                    onMouseEnter={() => setTooltip(isAnswerOption ? `${userGuess}?` : (isCompleted ? countryName : ''))}
                    onMouseLeave={() => setTooltip('')}
                  />)
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </>
  )
}

export default memo(observer(Map));