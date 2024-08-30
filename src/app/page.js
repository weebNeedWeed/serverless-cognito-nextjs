"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { get, post } from "@aws-amplify/api";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-1_hfCJKnwxq",
      userPoolClientId: "acseb1cb0jkbmncudhf3efm0d",
    },
  },
  API: {
    REST: {
      myApiGw: {
        endpoint:
          "https://560fo9sve7.execute-api.ap-southeast-1.amazonaws.com/v1",
        region: "ap-southeast-1",
      },
    },
  },
});

export default function Home() {
  const getUserData = async () => {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();
    console.log("getUserData", user);
  };

  const fetchApiData = async () => {
    const session = await fetchAuthSession();
    const ops = get({
      apiName: "myApiGw",
      path: "/hello",
      options: {
        headers: {
          Authorization: session.tokens.idToken,
        },
      },
    });
    const data = await ops.response;
    console.log(await data.body.json());
  };

  const postApiData = async () => {
    const session = await fetchAuthSession();
    const ops = post({
      apiName: "myApiGw",
      path: "/hello",
      options: {
        body: {
          name: "John",
        },
        headers: {
          Authorization: session.tokens.idToken,
        },
      },
    });
    const data = await ops.response;
    console.log(await data.body.json());
  };

  return (
    <Authenticator
      signUpAttributes={["name"]}
      loginMechanisms={["email"]}
      socialProviders={["google"]}
    >
      {({ signOut, user }) => {
        console.log(user);
        return (
          <main>
            <button onClick={getUserData}>Call User</button>
            <button onClick={fetchApiData}>Call Api</button>
            <button onClick={postApiData}>post Api</button>

            <div>Hello {user.signInDetails.loginId}</div>
            <button onClick={signOut}>signOut</button>
          </main>
        );
      }}
    </Authenticator>
  );
}
