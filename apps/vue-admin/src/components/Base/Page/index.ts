// export { default as Page } from './Page'

import type { App } from 'vue'
import Page from './src/Page'
import Header from './src/Header'
import Content from './src/Content'
import Footer from './src/Footer'
import Sider from './src/Sider'

import { withInstall } from '@/components/util'


export const PageHeader = Header
export const PageContent = Content
export const PageFooter = Footer
export const PageSider = Sider


export default withInstall(Page, {
  Header,
  Content,
  Footer,
  Sider,
  install: function (app: App) {
    app.component(Page.name, Page);
    app.component(Header.name, Header);
    app.component(Content.name, Content);
    app.component(Footer.name, Footer);
    app.component(Sider.name, Sider);
    // return app;
  }
})

