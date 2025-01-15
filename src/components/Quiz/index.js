import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header,
} from 'semantic-ui-react';
import he from 'he';

import Countdown from '../Countdown';
import { getLetter } from '../../utils';

const Quiz = ({ data, countdownTime, endQuiz }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSlectedAns, setUserSlectedAns] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);
  const [mostrarResposta, setMostrarResposta] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showResolutionCounter, setShowResolutionCounter] = useState(true);

  useEffect(() => {
    if (questionIndex > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questionIndex]);

  const handleItemClick = (e, { name }) => {
    setUserSlectedAns(name);
  };

  const handleNext = () => {
    let point = 0;
    if (userSlectedAns === he.decode(data[questionIndex].correct_answer)) {
      point = 1;
    }

    const qna = questionsAndAnswers;
    qna.push({
      question: he.decode(data[questionIndex].question),
      user_answer: userSlectedAns,
      correct_answer: he.decode(data[questionIndex].correct_answer),
      point,
    });

    if (questionIndex === data.length - 1) {
      return endQuiz({
        totalQuestions: data.length,
        correctAnswers: correctAnswers + point,
        timeTaken,
        questionsAndAnswers: qna,
      });
    }

    setCorrectAnswers(correctAnswers + point);
    setQuestionIndex(questionIndex + 1);
    setUserSlectedAns(null);
    setQuestionsAndAnswers(qna);
  };

  const timeOver = timeTaken => {
    return endQuiz({
      totalQuestions: data.length,
      correctAnswers,
      timeTaken,
      questionsAndAnswers,
    });
  };

  return (
    <Item.Header>
      <Container>
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Content>
                <Item.Extra>
                  <span style={{
                    fontSize: '1.5em',
                    color: '#333'
                  }}>
                    {`Question ${questionIndex + 1} of ${data.length}`}
                    {showResolutionCounter &&
                      <span style={{ fontSize: '0.7em', fontWeight: 'normal', marginLeft: 5, color: '#666' }}>
                        (
                        <>
                          <strong>{questionsAndAnswers.length}</strong> solved
                          ,
                          <span style={{ color: 'green' }}><strong> {correctAnswers} </strong>correct </span>
                          and
                          <span style={{ color: 'red' }}><strong> {questionsAndAnswers.length - correctAnswers}</strong> errors</span>

                        </>

                        )

                      </span>

                    }
                    {
                      showResolutionCounter ?

                        <span onClick={() => setShowResolutionCounter(!showResolutionCounter)} style={{ cursor: 'pointer', color: '#ffa6a6' }}>
                          <Icon name="eye slash" style={{ marginLeft: 5, marginRight: 5, fontSize: '0.7em' }}
                          />
                        </span>
                        :
                        <span onClick={() => setShowResolutionCounter(!showResolutionCounter)}
                        style={{ cursor: 'pointer', color: '', fontSize: '0.7em', color: '#888', marginLeft: 10 }}> 
                          Show Resolutions
                          <Icon name="eye" style={{ marginLeft: 5, marginRight: 5, fontSize: '1em'  }} />
                        </span>
                    }

                  </span>
                  <Countdown
                    countdownTime={countdownTime}
                    timeOver={timeOver}
                    setTimeTaken={setTimeTaken}
                  />
                </Item.Extra>
                <br />

                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Icon name="info circle" size='big' style={{ color: '' }} />
                  <div>
                    <Item.Meta>
                      Discipline:
                      <span style={{ color: '#3398da', marginLeft: 5 }}>
                        {he.decode(data[questionIndex].discipline)}
                      </span>
                    </Item.Meta>

                    <Item.Meta>
                      Category: {
                        showCategory ?
                          <span style={{ color: '#3398da', marginLeft: 5 }}>
                            {he.decode(data[questionIndex].category)}

                            <span onClick={() => setShowCategory(!showCategory)} style={{ cursor: 'pointer', color: '#ffa6a6' }}>
                              <Icon name="eye slash" style={{ marginLeft: 5, marginRight: 5, fontSize: '0.7em'  }}
                              />
                            </span>
                          </span>

                          :
                          <span onClick={() => setShowCategory(!showCategory)} style={{ cursor: 'pointer', color: '' }}>
                            Show Category
                            <Icon name="eye" style={{ marginLeft: 5, marginRight: 5, fontSize: '0.7em'  }} />
                          </span>
                      }
                    </Item.Meta>
                  </div>
                </div>
                <Item.Meta>

                  <Divider />
                  <br />
                  <Item.Description>
                    <span style={{
                      fontSize: '1.1em',
                      color: '#333',
                    }}>
                      {`${he.decode(data[questionIndex].question)}`}
                    </span>
                  </Item.Description>


                  <Menu vertical fluid size="massive">
                    {data[questionIndex].options.map((option, i) => {
                      const letter = getLetter(i);
                      const decodedOption = he.decode(option);

                      return (
                        <Menu.Item
                          key={decodedOption}
                          name={decodedOption}
                          active={userSlectedAns === decodedOption}
                          onClick={handleItemClick}
                          color={mostrarResposta && userSlectedAns === he.decode(data[questionIndex].correct_answer) ? 'green' : 'red'}
                          style={{
                            fontSize: '0.8em'
                          }}

                        >
                          <b style={{ marginRight: '8px' }}>{letter}</b>
                          {decodedOption}
                        </Menu.Item>
                      );
                    })}
                  </Menu>
                </Item.Meta>
                <Divider />
                {
                  mostrarResposta && userSlectedAns && (
                    <>
                      {userSlectedAns === he.decode(data[questionIndex].correct_answer) ? (
                        <span style={{ color: 'green', fontSize: '1.2em' }}>
                          <Icon name="check circle" size='big' />
                          Correct Answer!
                        </span>
                      ) : (
                        <span style={{ color: 'red', fontSize: '1.2em' }}>
                          <Icon name="times circle" size='big' />
                          Incorrect Answer!
                          <p style={{ color: 'black' }}>Answer: <strong>{he.decode(data[questionIndex].correct_answer)}</strong></p>
                        </span>
                      )}

                      <Message>
                        <Message.Header>Explanation</Message.Header>
                        <p>{he.decode(data[questionIndex].explanation)}</p>
                      </Message>

                    </>
                  )
                }
                <Item.Extra>
                  <Button
                    primary
                    content="Next"
                    onClick={handleNext}
                    floated="right"
                    size="big"
                    icon="right chevron"
                    labelPosition="right"
                    disabled={!userSlectedAns}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <br />
      </Container>
    </Item.Header>
  );
};

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  countdownTime: PropTypes.number.isRequired,
  endQuiz: PropTypes.func.isRequired,
};

export default Quiz;
