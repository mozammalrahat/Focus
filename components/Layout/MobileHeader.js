import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container, Dropdown, Icon, Menu } from "semantic-ui-react";
import { logoutUser } from "../../utils/authUser";

function MobileHeader({
  user: { unreadNotification, email, unreadMessage, username },
}) {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;
  const pathString = router.pathname.slice(0, 3);

  return (
    <>
      <Menu fluid borderless>
        <Container text>
          <Link href="/">
            <Menu.Item header active={isActive("/")}>
              <Icon name="rss" size="large" />
            </Menu.Item>
          </Link>

          {pathString === "/qa" ? (
            <>
              <Link href="/qa">
                <Menu.Item header active={isActive("/qa")}>
                  <Icon
                    name="question circle outline"
                    size="large"
                    color={isActive("/qa") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Link href="/qa/jobpostIndex">
                <Menu.Item header active={isActive("/qa/jobpostIndex")}>
                  <Icon
                    name="briefcase"
                    size="large"
                    color={isActive("/qa/jobpostIndex") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Link href="/messages">
                <Menu.Item
                  header
                  active={isActive("/messages") || unreadMessage}
                >
                  <Icon
                    name={unreadMessage ? "hand point right" : "mail outline"}
                    size="large"
                    color={isActive("/messages") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Link href="/qa/notifications">
                <Menu.Item
                  header
                  active={isActive("/qa/notifications") || unreadNotification}
                >
                  <Icon
                    name={
                      unreadNotification ? "hand point right" : "bell outline"
                    }
                    size="large"
                    color={isActive("/qa/notifications") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Dropdown item icon="bars" direction="left">
                <Dropdown.Menu>
                  <Link href={`/qa/${username}`}>
                    <Dropdown.Item active={isActive(`/qa/${username}`)}>
                      <Icon
                        name="user"
                        size="large"
                        color={isActive(`/qa/${username}`) && "blue"}
                      />
                      Account
                    </Dropdown.Item>
                  </Link>

                  <Link href="/search">
                    <Dropdown.Item active={isActive("/search")}>
                      <Icon
                        name="search"
                        size="large"
                        color={isActive("/search") && "blue"}
                      />
                      Search
                    </Dropdown.Item>
                  </Link>

                  <Dropdown.Item onClick={() => logoutUser(email)}>
                    <Icon name="sign out alternate" size="large" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : pathString === "/st" ? (
            <>
              <Link href="/studentshub">
                <Menu.Item header active={isActive("/studentshub")}>
                  <Icon
                    name={unreadMessage ? "hand point right" : "mail outline"}
                    size="large"
                    color={isActive("/st") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Link href="/messages">
                <Menu.Item
                  header
                  active={isActive("/messages") || unreadMessage}
                >
                  <Icon
                    name={unreadMessage ? "hand point right" : "mail outline"}
                    size="large"
                    color={isActive("/messages") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Link href="/studentshub/notifications">
                <Menu.Item
                  header
                  active={
                    isActive("/studentshub/notifications") || unreadNotification
                  }
                >
                  <Icon
                    name={
                      unreadNotification ? "hand point right" : "bell outline"
                    }
                    size="large"
                    color={isActive("/studentshub/notifications") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Dropdown item icon="bars" direction="left">
                <Dropdown.Menu>
                  <Link href={`/studentshub/${username}`}>
                    <Dropdown.Item
                      active={isActive(`/studentshub/${username}`)}
                    >
                      <Icon
                        name="user"
                        size="large"
                        color={isActive(`/studentshub/${username}`) && "blue"}
                      />
                      Account
                    </Dropdown.Item>
                  </Link>

                  <Link href="/search">
                    <Dropdown.Item active={isActive("/search")}>
                      <Icon
                        name="search"
                        size="large"
                        color={isActive("/search") && "blue"}
                      />
                      Search
                    </Dropdown.Item>
                  </Link>

                  <Dropdown.Item onClick={() => logoutUser(email)}>
                    <Icon name="sign out alternate" size="large" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : pathString === "/me" ? (
            <>
              <Link href="/">
                <Menu.Item active={isActive("/")}>
                  <Icon
                    name="home"
                    size="large"
                    color={isActive("/") && "blue"}
                  />
                </Menu.Item>
              </Link>
              <br />

              <Link href="/resource">
                <Menu.Item active={isActive("/resource")}>
                  <Icon
                    name="graduation cap"
                    size="large"
                    color={isActive("/resource") && "blue"}
                  />
                </Menu.Item>
              </Link>
              <br />

              <Link href="/studentshub">
                <Menu.Item active={isActive("/studentshub")}>
                  <Icon
                    name="newspaper outline"
                    size="large"
                    color={isActive("/studentshub") && "blue"}
                  />
                </Menu.Item>
              </Link>
              <br />
              <Link href="/qa">
                <Menu.Item active={isActive("/qa")}>
                  <Icon
                    name="question circle outline"
                    size="large"
                    color={
                      (isActive("/qa") && "blue") ||
                      (unreadNotification && "red")
                    }
                  />
                </Menu.Item>
              </Link>
              <br />
              <Dropdown item icon="bars" direction="left">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => logoutUser(email)}>
                    <Icon name="sign out alternate" size="large" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Link href="/resource">
                <Menu.Item header active={isActive("/resource")}>
                  <Icon
                    name="graduation cap"
                    size="large"
                    color={isActive("/resource") && "blue"}
                  />
                </Menu.Item>
              </Link>
              <Link href="/resource/files">
                <Menu.Item header active={isActive("/resource/files")}>
                  <Icon
                    name="newspaper outline"
                    size="large"
                    color={isActive("/resource/files") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Link href="/resource/universityIndex">
                <Menu.Item
                  header
                  active={isActive("/resource/universityIndex")}
                >
                  <Icon
                    name="university"
                    size="large"
                    color={isActive("/resource/universityIndex") && "blue"}
                  />
                </Menu.Item>
              </Link>

              <Dropdown item icon="bars" direction="left">
                <Dropdown.Menu>
                  <Link href="#">
                    <Dropdown.Item
                      header
                      active={isActive("/messages") || unreadMessage}
                    >
                      <Icon
                        name={
                          unreadMessage ? "hand point right" : "mail outline"
                        }
                        size="large"
                        color={isActive("/messages") && "blue"}
                      />
                      Messages
                    </Dropdown.Item>
                  </Link>

                  <Link href="/studentshub/notifications">
                    <Dropdown.Item
                      header
                      active={
                        isActive("/studentshub/notifications") ||
                        unreadNotification
                      }
                    >
                      <Icon
                        name={
                          unreadNotification
                            ? "hand point right"
                            : "bell outline"
                        }
                        size="large"
                        color={isActive("/studentshub/notifications") && "blue"}
                      />
                      Notifications
                    </Dropdown.Item>
                  </Link>
                  <Link href={`/studentshub/${username}`}>
                    <Dropdown.Item
                      active={isActive(`/studentshub/${username}`)}
                    >
                      <Icon
                        name="user"
                        size="large"
                        color={isActive(`/studentshub/${username}`) && "blue"}
                      />
                      Account
                    </Dropdown.Item>
                  </Link>

                  <Link href="/search">
                    <Dropdown.Item active={isActive("/search")}>
                      <Icon
                        name="search"
                        size="large"
                        color={isActive("/search") && "blue"}
                      />
                      Search
                    </Dropdown.Item>
                  </Link>

                  <Dropdown.Item onClick={() => logoutUser(email)}>
                    <Icon name="sign out alternate" size="large" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Container>
      </Menu>
    </>
  );
}

export default MobileHeader;
