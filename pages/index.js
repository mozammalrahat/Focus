import cookie from "js-cookie";
import Router from "next/router";
import React from "react";
import { Grid, Icon } from "semantic-ui-react";

function Home() {
  const handleLink = (path) => {
    if (cookie.get("token")) {
      Router.push(path);
      console.log("redirecting to Students Hub");
    } else {
      Router.push("/login");
    }
  };

  return (
    <>
      <Grid
        style={{ marginTop: 80 }}
        centered
        stackable
        relaxed="very"
        celled
        stretched
      >
        <Grid.Row centered stretched>
          <Grid.Column width={8} textAlign="center" verticalAlign="middle">
            <Icon
              name="question circle"
              size="massive"
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => handleLink("qa/")}
            />
          </Grid.Column>

          <Grid.Column width={8} textAlign="center" verticalAlign="middle">
            <h1>Job Resources & QA Section</h1>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={8} textAlign="center" verticalAlign="middle">
            <h1>Students Hub</h1>
          </Grid.Column>

          <Grid.Column width={8} textAlign="center" verticalAlign="middle">
            <Icon
              name="student"
              size="massive"
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => handleLink("studentshub/")}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row stretched>
          <Grid.Column width={8} textAlign="center" verticalAlign="middle">
            <Icon
              name="book"
              size="massive"
              color="blue"
              style={{ cursor: "pointer" }}
            />
          </Grid.Column>
          <Grid.Column width={8} textAlign="center" verticalAlign="middle">
            <h1>Resources</h1>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

export default Home;
