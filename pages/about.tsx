import SafeAreaView from "components/Misc/safeAreaView";
import Helmet from "../components/Navigation/Helmet";
import Layout from "../components/Navigation/Layout";
import { Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import LineSeparator from "components/Misc/lineSeparator";

function about() {
  return (
    <Layout>
      <SafeAreaView>
        <Helmet title="About" />
        <div className="xl:w-5/12 lg:w-6/12 md:w-10/12 mx-auto xl:mt-32 p-4 md:p-2">
          <h3 className="text-md font-semibold mb-4 tracking-wider">About</h3>

          <p className="text-gray-600 mt-3 leading-tight">
            As I’ve gotten older (and not to be dramatic), I’ve realised that it is quite important to me that I have
            some medium to collate and organise my trips and photos and share them in some way. Partly for my future
            self to look back on but also to put something as authentic as possible out into the world. I also have
            found that writing about trips after they have happened has been a great way to internalise and process
            them, beyond relying on photos on a phone or a hazy recollection of memories in the future.
          </p>
          <p className="text-gray-600 mt-3 leading-tight">
            It is a small site that doesn’t get many views, and I certainly do not promote it anywhere, but if you have
            found this in your search for knowledge about a particular trip I have done then perhaps there is something
            of value here for you.
          </p>
          <p className="text-gray-600 mt-3 leading-tight">
            If you have something to say, you can get in touch with me.
          </p>
          <p className="text-gray-600 mt-3 leading-tight">And if not, thank you for visiting.</p>
          <div className="md:mt-10 mt-4">
            <LineSeparator />
            <ul className="space-y-3 text-gray-600 md:mt-4 mt-2">
              <a
                href="mailto:james.ide775@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={16} />
                <span>james.ide775@gmail.com</span>
              </a>
              <a
                href="https://www.instagram.com/james.ide/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram size={16} />
                <span>@james.ide</span>
              </a>
              <a
                href="https://github.com/jameside"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={16} />
                <span>@jameside</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>Adelaide, Australia</span>
              </div>
            </ul>
            <p className="text-gray-600 mt-5 text-sm">Built with NextJS, Markdown, Contentful and TailwindCSS.</p>
          </div>
        </div>
      </SafeAreaView>
    </Layout>
  );
}
export default about;
