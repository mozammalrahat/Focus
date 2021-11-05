import cookie from "js-cookie";
import Router from "next/router";
import React from "react";
import { Grid, Icon } from "semantic-ui-react";

function Home() {
  const handleLink = () => {
    Router.push("/studentshub");
    // Router.reload();
    console.log("Studentshub url has been inserted");
    console.log(cookie.get("token"));
  };
  return (
    <Grid celled stretched>
      <Grid.Row centered stretched>
        <Grid.Column width={8} textAlign="center" verticalAlign="middle">
          {/* <Link href="/studentshub"> */}
          <Icon
            name="question circle"
            size="massive"
            color="blue"
            style={{ cursor: "pointer" }}
            onClick={handleLink}
          />
          {/* </Link> */}
        </Grid.Column>

        <Grid.Column width={8} textAlign="center" verticalAlign="middle">
          <h1>Q&A Section</h1>
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
  );
}

export default Home;
