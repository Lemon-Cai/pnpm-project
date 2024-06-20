
import InternalPage from './Page'

import Content from './Content'
import Footer from './Footer'
import Header from './Header';

export type { PageImpl as PageProps } from './Page';
export type { ContentImpl as ContentProps } from './Content';
export type { HeaderImpl as HeaderProps } from './Header';
export type { FooterImpl as FooterProps } from './Footer';

type InternalLayoutType = typeof InternalPage;

type CompoundedComponent = InternalLayoutType & {
    Header: typeof Header;
    Footer: typeof Footer;
    Content: typeof Content;
    // Sider: typeof Sider;
};
const Page = InternalPage as CompoundedComponent;

Page.Footer = Footer
Page.Content = Content
Page.Header = Header

export default Page
