import Layout from "@theme/Layout";
import React from "react";

export default () => {
  return (
    <Layout>
      <div class="hero hero--primary">
        <div class="container">
          <h1 class="hero__title">Looking for help?</h1>
          <div></div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col col--4">
            <div class="card">
              <div class="card__header">
                <h3>Discussion</h3>
              </div>
              <div class="card__body">
                <p>
                  For things related to the NEO ecosystem, please check out the
                  COZ forums.
                </p>
              </div>
              <div class="card__footer">
                <a
                  class="button button--secondary button--block"
                  href="https://forum.coz.io/c/technical/6"
                >
                  Forum
                </a>
              </div>
            </div>
          </div>

          <div class="col col--4">
            <div class="card">
              <div class="card__header">
                <h3>Bug</h3>
              </div>
              <div class="card__body">
                <p>
                  If you encounter an issue that feels like a bug, feel free to
                  open an issue directly on our Github repository.
                </p>
              </div>
              <div class="card__footer">
                <a
                  class="button button--secondary button--block"
                  href="https://github.com/cityofzion/neon-js"
                >
                  Github
                </a>
              </div>
            </div>
          </div>

          <div class="col col--4">
            <div class="card">
              <div class="card__header">
                <h3>Other issues</h3>
              </div>
              <div class="card__body">
                <p>For non-technical discussion, there is always Reddit.</p>
              </div>
              <div class="card__footer">
                <a
                  class="button button--secondary button--block"
                  href="https://www.reddit.com/r/NEO/"
                >
                  Reddit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
