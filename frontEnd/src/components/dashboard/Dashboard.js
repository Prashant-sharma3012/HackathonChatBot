import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import ShortLogo from '../../assests/images/shortLogo.png'
import 'react-chat-widget/lib/styles.css';
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import axios from 'axios'
import { Bar, Doughnut } from 'react-chartjs-2'
import './styles.css'


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamTitles: undefined,
      positionTypeCount: undefined,
      totalCountOfTeam: undefined,
      userInfo: undefined
    }
  }
  componentDidMount() {
    let { idToken } = JSON.parse(localStorage.getItem("okta-token-storage"))
    let usrName = idToken.claims.name
    addResponseMessage(`Welcome ${usrName}😊`);
    axios.get('http://localhost:8000/teamInfo').then(res => {
      console.log("------------", res.data)
      const data = res.data.teamStructure
      const teamTitles = Object.keys(data)
      let count = 0
      const positionTypeCount = teamTitles.map(d => {
        count = count + data[d].length;
        return data[d].length
      })
      console.log("=========teamTitles=========", teamTitles)
      console.log("========positionTypeCount==========", positionTypeCount)
      this.setState({
        teamTitles,
        positionTypeCount,
        totalCountOfTeam: count,
        userInfo: res.data.userData
      })
    })
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incomig! ${newMessage}`);
    // Now send the message throught the backend API
    axios.post('http://localhost:8000/ansMsg', { msg: newMessage }).then(res => {
      addResponseMessage(res.data.message)
    })
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    const { teamTitles, positionTypeCount, totalCountOfTeam, userInfo } = this.state
    console.log("--------", userInfo)
    return (
      // <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
        >
          <Fab
            variant="extended"
            aria-label="Apply"
            title='Logout'
            size="medium"
            color="secondary"
            onClick={this.onLogoutClick}
            style={{
              margin: 30
            }}
          >
            Logout&nbsp; <ExitToAppRoundedIcon />
          </Fab>
        </Grid>
        <Grid xs={12} container
          direction="row"
          justify="center"
          alignItems="center">
          <Grid xs={5} item>
            <Bar
              height={300}
              options={{
                title: {
                  display: true,
                  text: userInfo && `Team ${userInfo.account}`,
                  fontSize: 24
                },
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                  display: false
                },
                animation: {
                  duration: 1000,
                  easing: "easeInOutQuint"
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        autoSkip: false
                      }
                    }
                  ],
                  yAxes: [
                    {
                      ticks: {
                        min: 0,
                        stepSize: 2
                      }
                    }
                  ]
                },
                tooltips: {
                  callbacks: {
                    label: toolTipItem => `Count: ${toolTipItem.yLabel}`
                  }
                }
              }}
              data={{
                labels: teamTitles,
                datasets: [{
                  barPercentage: 0.5,
                  label: 'Your Team',
                  data: positionTypeCount,
                  backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                }]
              }}
            />

          </Grid>
          <Grid xs={5} item>
            <Doughnut
              data={{
                labels: teamTitles,
                datasets: [
                  {
                    label: "% Share of members",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850",],
                    data: positionTypeCount
                  }
                ]
              }}
              options={
                {
                  title: {
                    display: true,
                    text: 'Percentage of different roles of people',
                    fontSize: 20
                  },
                  tooltips: {
                    callbacks: {
                      label: (toolTipItem, data) => {
                        // console.log(data.datasets[0].data[toolTipItem.index], totalCountOfTeam)
                        const res = (data.datasets[0].data[toolTipItem.index] / totalCountOfTeam) * 100
                        return `${res.toFixed(2)} %`
                      }
                    }
                  }
                }
              }
            />
          </Grid>
        </Grid>


        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          profileAvatar={ShortLogo}
          title="This is Bot baba reporting"
          subtitle="At your service"
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => {
    dispatch(logoutUser());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
