import Layout from "@theme/Layout";
import React from "react";

export default () => {
  return (
    <Layout title="NeonJS">
      <div class="hero hero--primary">
        <div class="container">
          <h1 class="hero__title">neon-js</h1>
          <p class="hero__subtitle">Javascript SDK for NEO blockchain</p>
          <div>
            <a
              class="button button--secondary button--outline button--lg"
              href="./docs"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col col--4">
            <div class="card__header">
              <h3>Web ready</h3>
            </div>
            <div class="card__body">
              <p>
                Written in Typescript, the package is designed to be deployed on
                both browser and server environments.
              </p>
            </div>
          </div>
          <div class="col col--4">
            <div class="card__header">
              <h3>Targeted for all levels</h3>
            </div>
            <div class="card__body">
              <p>
                Various API interfaces are exposed for different users.
                Beginners can opt to follow the tutorial and use the prebuilt
                facade methods. Then, break out and craft your own logic using
                the same tooling.
              </p>
            </div>
          </div>
          <div class="col col--4">
            <div class="card__header">
              <h3>Open sourced</h3>
            </div>
            <div class="card__body">
              <p>
                This package is MIT-licensed so there is no fees or strings
                attached.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
