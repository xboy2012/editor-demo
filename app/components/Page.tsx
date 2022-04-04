import { Editor } from '@tinymce/tinymce-react';
import 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-dark.css';
import { defaultContent } from "./defaultContent";

const configs = {
    codesample_languages: [
        { text: 'JavaScript', value: 'javascript' },
        { text: 'TypeScript', value: 'typescript' },
        { text: 'CSS', value: 'css' },
        { text: 'PHP', value: 'php' },
        { text: 'Ruby', value: 'ruby' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C', value: 'c' },
        { text: 'C#', value: 'csharp' },
        { text: 'C++', value: 'cpp' }
    ],
    codesample_global_prismjs: true,
};

export const Page = () => {
  return (
    <div>
      <Editor
        plugins="codesample"
        toolbar="codesample"
        inline={true}
        initialValue={defaultContent}
        // onChange={(e) => {
        //     console.log(e);
        // }}
        init={configs}
      />
    </div>
  );
};
