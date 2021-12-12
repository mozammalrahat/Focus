import cookie from "js-cookie";
import Router from "next/router";
import React from "react";
import { Button, Grid, Icon, Image } from "semantic-ui-react";
import { logoutUser } from "../utils/authUser";

function Home({ user }) {
  const handleLink = (path) => {
    if (cookie.get("token")) {
      Router.push(path);
    } else {
      Router.push("/login");
    }
  };
  const email = user ? user.email : null;

  return (
    <div>
      <Grid relaxed divided container centered>
        <Grid.Row>
          <Image
            avatar
            centered
            src="/focus.PNG"
            size="small"

            // style={{
            //   marginLeft: "163px",
            //   width: "270px",
            // }}
          />
        </Grid.Row>

        <Grid.Row style={{ margin: "20px" }}>
          <Button
            className="button1"
            style={{
              borderColor: "black",
              borderStyle: "outset",
              color: "black",
              backgroundColor: "#c4e6f3",
              height: "auto",
              borderRadius: "20px",
              width: "460px",
            }}
            inverted
            onClick={() => handleLink("qa/")}
          >
            <div>
              <h1>
                <Icon
                  name="question circle"
                  size="large"
                  style={{ cursor: "pointer" }}
                />{" "}
                Job Resources & QA Section
              </h1>
            </div>
          </Button>
        </Grid.Row>

        <Grid.Row style={{ margin: "20px" }}>
          <Button
            className="button1"
            style={{
              borderColor: "black",
              borderStyle: "outset",
              color: "black",
              backgroundColor: "#c4e6f3",
              height: "auto",
              borderRadius: "20px",
              width: "460px",
            }}
            inverted
            onClick={() => handleLink("studentshub/")}
          >
            <div>
              <h1>
                <Icon
                  name="student"
                  size="large"
                  style={{ cursor: "pointer" }}
                />{" "}
                Students Hub
              </h1>
            </div>
          </Button>
        </Grid.Row>

        <Grid.Row style={{ margin: "20px" }}>
          <Button
            className="button1"
            style={{
              borderColor: "black",
              borderStyle: "outset",
              color: "black",
              backgroundColor: "#c4e6f3",
              height: "auto",
              borderRadius: "20px",
              width: "460px",
            }}
            inverted
            onClick={() => handleLink("resource/")}
          >
            <div>
              <h1>
                <Icon name="book" size="large" style={{ cursor: "pointer" }} />{" "}
                Higher Study & Resources
              </h1>
            </div>
          </Button>
        </Grid.Row>

        <Grid.Row style={{ margin: "20px" }}>
          {email && (
            <Button
              primary
              size="massive"
              floated="right"
              onClick={() => logoutUser(email)}
            >
              Logout
            </Button>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
