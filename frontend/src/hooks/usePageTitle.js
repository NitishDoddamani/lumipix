import { useEffect } from "react";

const SITE_NAME = "Lumipix";

export default function usePageTitle(title, description) {

  useEffect(() => {

    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;

    document.title = fullTitle;

    if (description) {

      let meta = document.querySelector('meta[name="description"]');

      if (!meta) {

        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);

      }

      meta.setAttribute("content", description);

    }

  }, [title, description]);

}