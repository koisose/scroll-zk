import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
export const head: DocumentHead = {
  title: "portal",
  meta: [
    {
      name: "description",
      content: "portal example",
    },
  ],
};
export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <p>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
        {head.title}
      </p>
    </>
  );
});


