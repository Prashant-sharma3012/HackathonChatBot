import React from 'react';

const PageNotFound = (props) => {
    // console.log("props-----------", props);
    return (
        <div style={{ height: "75vh" }} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align">
              <h4>
                404 Page Not Found
              </h4>
              <button
                style={{
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                onClick={() => {
                    props.history.push("/dashboard");
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Back to Home Page
              </button>
            </div>
          </div>
        </div>
      );
}


export default PageNotFound;