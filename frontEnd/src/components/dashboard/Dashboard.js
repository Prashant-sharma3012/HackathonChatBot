import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {
  Widget,
  addResponseMessage,
  addLinkSnippet,
  addUserMessage
} from "react-chat-widget";
import ShortLogo from "../../assests/images/shortLogo.png";
import "react-chat-widget/lib/styles.css";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import "./styles.css";
import Tree from 'react-d3-tree';

const myTreeData = [
  {
    name: 'Cisco',
    children: [
      {
        name: 'Senior Engineer',
        children: [
          {
            name: 'Suresh',
          }, 
          {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, 
        ]
      },
      {
        name: 'Lead Engineer',
        children: [
          {
            name: 'Suresh',
          }, 
          {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, 
        ]
      },
      {
        name: 'Architect',
        children: [
          {
            name: 'Suresh',
          }, 
          {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, 
        ]
      },
      {
        name: 'Engineer',
        children: [
          {
            name: 'Suresh',
          }, 
          {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, {
            name: 'Suresh',
          }, 
        ]
      },
    ],
  },
];


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamTitles: undefined,
      teamStructure: undefined,
      positionTypeCount: undefined,
      totalCountOfTeam: undefined,
      userInfo: undefined,
      treeStruct: undefined
    };
  }
  componentDidMount() {
    addResponseMessage("Welcome Enquerian!");
    addResponseMessage("How can I help you?");

    axios.get("http://localhost:8000/teamInfo").then(res => {
      console.log("------------", res.data);
      const data = res.data.teamStructure;
      const teamTitles = Object.keys(data);
      let count = 0;
      const positionTypeCount = teamTitles.map(d => {
        count = count + data[d].length;
        return data[d].length;
      });
      console.log("=========teamTitles=========", teamTitles);
      console.log("========positionTypeCount==========", positionTypeCount);
      let treeStruct = {

      }

      treeStruct.name = res.data.userData.account
      treeStruct['children'] = Object.keys(data).map(title=>{
        return {
          name: title,
          children: data[title].map(data=>{
            return{
              name: data.firstName.toUpperCase()
            }
          })
        }
      })

      this.setState({
        teamTitles,
        positionTypeCount,
        totalCountOfTeam: count,
        userInfo: res.data.userData,
        teamStructure: data,
        treeStruct: [treeStruct]
      });
    });
  }

  handleNewUserMessage = newMessage => {
    console.log(`New message incomig! ${newMessage}`);
    // Now send the message throught the backend API
    axios
      .post("http://localhost:8000/ansMsg", { msg: newMessage })
      .then(res => {
        addResponseMessage(res.data.message);
      });
  };
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    const {
      teamTitles,
      positionTypeCount,
      totalCountOfTeam,
      userInfo,
      teamStructure,
      treeStruct
    } = this.state;
    console.log("---------original----", myTreeData)
    console.log("-----formed---", treeStruct);
    return (
      // <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div style={{marginBottom: 40, marginLeft: 50, marginRight: 50}}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <Fab
            variant="extended"
            aria-label="Apply"
            title="Logout"
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
        <Grid
          xs={6}
          style={{ marginLeft: 60, marginBottom: 100, color: "#187E91" }}
        >
          <h1>Welcome {userInfo && userInfo.firstName.toUpperCase()}!</h1>
        </Grid>
        <Grid
          xs={12}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
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
                datasets: [
                  {
                    barPercentage: 0.5,
                    label: "Your Team",
                    data: positionTypeCount,
                    backgroundColor: [
                      "#3e95cd",
                      "#8e5ea2",
                      "#3cba9f",
                      "#e8c3b9",
                      "#c45850",
                      "#3c6865",
                      "#1f8475",
                      "#3bb5ff"
                    ]
                  }
                ]
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
                    backgroundColor: [
                      "#3e95cd",
                      "#8e5ea2",
                      "#3cba9f",
                      "#e8c3b9",
                      "#c45850",
                      "#3c6865",
                      "#1f8475",
                      "#3bb5ff"
                    ],
                    data: positionTypeCount
                  }
                ]
              }}
              options={{
                title: {
                  display: true,
                  text: "People by Percentage",
                  fontSize: 20
                },
                tooltips: {
                  callbacks: {
                    label: (toolTipItem, data) => {
                      // console.log(data.datasets[0].data[toolTipItem.index], totalCountOfTeam)
                      const res =
                        (data.datasets[0].data[toolTipItem.index] /
                          totalCountOfTeam) *
                        100;
                      return `${res.toFixed(2)} %`;
                    }
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        <div>
          <h1 style={{ marginLeft: 60, marginBottom: 50, marginTop: 100, color: "#187E91" }}>{`Your Hierrarchy (Team "${userInfo && userInfo.account}")`}</h1>
          {userInfo && (
            <div style={{   
              margin: '0px auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'}}>
              <span className='hierarchyStyle'>{`${userInfo.deliveryLead} (Delivery Lead)`}</span>
              <div style={{ fontSize: 60 }}>&#8595;</div>
              <span className='hierarchyStyle'>{`${userInfo.practiceLead} (Practice Lead)`}</span>
              <div style={{ fontSize: 60 }}>&#8595;</div>
              <span className='hierarchyStyle'>{`${userInfo.reportingLead} (Reporting Lead)`}</span>
              <div style={{ fontSize: 60 }}>&#8595;</div>
              <span className='hierarchyStyle'>{`${userInfo.firstName.toUpperCase()} (You)`}</span>
            </div>
          )}
        </div>

        <div style={{marginLeft: 60, marginBottom: 50, marginTop: 100, }}>
          <h1 style={{ color: "#187E91", marginBottom: 50 }}>{`Your Team Members`}</h1>
          {teamStructure && 
            <div>
            {Object.keys(teamStructure).map(title=>{
              return (
                <div>
                    <h3>{title}</h3>
                    <div style={{display:'flex',flexDirection:'row', flexWrap:'wrap'}}>
                    {
                      teamStructure[title].map(members=>
                        <span className='chipStyle'>
                          {members.firstName.toUpperCase()}
                        </span> 
                      )
                    }
                    </div>
                </div>
              )
            })}
            </div>
          }
        </div>

        <div id="treeWrapper" style={{width: '100%', minHeight: 500, backgroundColor: 'white'}}>
 
          {treeStruct &&
          <Tree style={{minHeight: 500}} data={treeStruct} orientation={"vertical"} />

          }
  
        </div>

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
