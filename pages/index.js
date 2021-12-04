import cookie from "js-cookie";
import Router from "next/router";
import React from "react";
import { Button, Grid, Icon, Image } from "semantic-ui-react";
import { logoutUser } from "../utils/authUser";

function Home({ user }) {
  const email = user ? user.email : "abc";
  const handleLink = (path) => {
    if (cookie.get("token")) {
      Router.push(path);
      // console.log("redirecting to Students Hub");
    } else {
      Router.push("/login");
    }
  };

  console.log(email);

  return (
    <>
      {email != "abc" ? (
        <>
          <Button
            inverted
            color="red"
            style={{
              position: "absolute",
              top: "30px",
              right: "40px",
              fontSize: "22px",
              height: "55px",
              width: "140px",
            }}
            onClick={() => logoutUser(email)}
          >
            Logout
          </Button>
        </>
      ) : (
        <></>
      )}
      <div>
        <Image
          src="/focus.PNG"
          size="large"
          style={{
            marginLeft: "163px",
            width: "270px",
          }}
        />
        <Grid
          style={{
            // marginTop: "10px",
            marginLeft: "50px",
          }}
        >
          <Grid.Row style={{ margin: "20px" }}>
            <Button
              className="button1"
              style={{
                borderColor: "black",
                borderStyle: "outset",
                color: "black",
                backgroundColor: "#c4e6f3",
                height: "100px",
                borderRadius: "20px",
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
              style={{
                borderColor: "black",
                borderStyle: "outset",
                color: "black",
                backgroundColor: "#c4e6f3",
                height: "100px",
                borderRadius: "20px",
              }}
              inverted
              onClick={() => handleLink("studentshub/")}
            >
              <div>
                <h1 style={{ width: "408px" }}>
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
              style={{
                borderColor: "black",
                borderStyle: "outset",
                color: "black",
                backgroundColor: "#c4e6f3",
                height: "100px",
                borderRadius: "20px",
              }}
              inverted
              onClick={() => handleLink("resource/")}
            >
              <div>
                <h1 style={{ width: "408px" }}>
                  <Icon
                    name="book"
                    size="large"
                    style={{ cursor: "pointer" }}
                  />{" "}
                  Higher Study & Resources
                </h1>
              </div>
            </Button>
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
}

export default Home;
