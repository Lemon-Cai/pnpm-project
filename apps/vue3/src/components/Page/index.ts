// export { default as Page } from './Page'

import type { App } from 'vue'
import Page from './Page'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import { withInstall } from '../util'

export type { PageProps } from './Page';


export const PageHeader = Header
export const PageContent = Content
export const PageFooter = Footer


export default withInstall(Page, {
  Header,
  Content,
  Footer,
  install: function (app: App) {
    app.component(Page.name, Page);
    app.component(Header.name, Header);
    app.component(Content.name, Content);
    app.component(Footer.name, Footer);
    // app.component(Sider.name, Sider);
    // return app;
  }
})

