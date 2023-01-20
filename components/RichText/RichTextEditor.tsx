import {
  DraftailEditor,
  BLOCK_TYPE,
  INLINE_STYLE,
  ENTITY_TYPE,
} from "draftail";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { convertToRaw, convertFromRaw } from "draft-js";

function RichTextEditor() {
  const exporterConfig = {};

  //   const toHTML = (raw) =>
  //     convertToHTML(exporterConfig)(convertFromRaw(raw))

  function toHtml(raw) {
    raw ? convertToHTML(exporterConfig)(convertFromRaw(raw)) : "";

    if (raw) {
      console.log("raw");
    } else {
      console.log("no raw");
    }
  }
  return (
    <div className="class w-3/4 mx-auto">
      <DraftailEditor
        onSave={(raw) => {
          toHtml(raw);
        }}
        // https://www.draftail.org/docs/entities for a tags :)
        blockTypes={[
          { type: BLOCK_TYPE.HEADER_ONE },
          { type: BLOCK_TYPE.HEADER_TWO },
          { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
          { type: BLOCK_TYPE.UNSTYLED },
        ]}
        inlineStyles={[
          { type: INLINE_STYLE.BOLD },
          { type: INLINE_STYLE.ITALIC },
        ]}
        className="border-red-500"
      />
    </div>
  );
}
export default RichTextEditor;
