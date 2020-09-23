/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')
const MarkdownBlock = CompLibrary.MarkdownBlock /* Used to read markdown */
const Container = CompLibrary.Container
const GridBlock = CompLibrary.GridBlock

const translate = require('../../server/translate.js').translate

const siteConfig = require(process.cwd() + '/siteConfig.js')

function imgUrl (img) {
  return siteConfig.baseUrl + 'img/' + img
}

function docUrl (doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc
}

function pageUrl (page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page
}

class Button extends React.Component {
  render () {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    )
  }
}

Button.defaultProps = {
  target: '_self'
}

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
)

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
)

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
)

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
)

class HomeSplash extends React.Component {
  render () {
    let language = this.props.language || ''
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('logo.svg')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('overview.html.html', language)}><translate>Get Started</translate></Button>
            <Button href={docUrl('guides/basic/sendasset.html', language)}><translate>Tutorial</translate></Button>
            <Button href={docUrl('api/index.html', language)}><translate>API</translate></Button>
            <Button href={docUrl('examples/index.html', language)}><translate>Examples</translate></Button>
          </PromoSection>
        </div>
      </SplashContainer>
    )
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
)

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        content: <translate>Key generation, manipulation and encryption</translate>,
        image: imgUrl('logo.svg'),
        imageAlign: 'top',
        title: 'Wallet'
      },
      {
        content: 'Transaction creation, serialization and signing.',
        image: imgUrl('logo.svg'),
        imageAlign: 'top',
        title: 'Transactions'
      },
      {
        content: 'Various API integration required for light wallet support',
        image: imgUrl('logo.svg'),
        imageAlign: 'top',
        title: 'Integration'
      }
    ]}
  </Block>
)

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: 'The SDK is made with both beginners and experts in mind. Start off with playing with the high level semantic API. Once you are comfortable, dive in deep and code your own custom tools with the modules provided.',
        image: imgUrl('logo.svg'),
        imageAlign: 'right',
        title: 'Made for everyone'
      }
    ]}
  </Block>
)

const TryOut = props => (
  <Block id="try">
    {[
      {
        content: 'Get your feet wet with our simple quickstart or follow one of our tutorials! Or heck that, just open your console and start playing with it!',
        image: imgUrl('console.png'),
        imageAlign: 'left',
        title: 'Try it Out'
      }
    ]}
  </Block>
)

const Description = props => (
  <Block background="dark">
    {[
      {
        content: 'We are open source and MIT-licensed, meaning anyone can use this library for free without reprecussions! This project is developed and maintained under the City of Zion community developer group and is supported by the NEO project team.',
        image: imgUrl('coz_med.png'),
        imageAlign: 'right',
        title: 'Open source'
      }
    ]}
  </Block>
)

class Index extends React.Component {
  render () {
    let language = this.props.language || ''

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <LearnHow />
          <TryOut />
          <Description />
        </div>
      </div>
    )
  }
}

module.exports = Index
