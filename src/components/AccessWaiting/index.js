import React from "react";
import "./css/style.css";
import {Link} from "react-router-dom";
export default function PageAccess() {
  return (
      <div className="error-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12 ">
              <div className="error-text">
                <h3 style={{
                  fontSize: "100px",
                  fontWeight: 100
                }}>Waiting To Access</h3>
                <div className="im-sheep">
                  <div className="top">
                    <div className="body" />
                    <div className="head">
                      <div className="im-eye one" />
                      <div className="im-eye two" />
                      <div className="im-ear one" />
                      <div className="im-ear two" />
                    </div>
                  </div>
                  <div className="im-legs">
                    <div className="im-leg" />
                    <div className="im-leg" />
                    <div className="im-leg" />
                    <div className="im-leg" />
                  </div>
                </div>
                <h4>Please wait platform active your account!</h4>

              </div>
            </div>
          </div>
        </div>
      </div>

  );
}
