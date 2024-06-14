# VSCode Clean Code Extension

This Visual Studio Code (VSCode) extension provides tools to help you maintain clean and readable code by automating the removal of comments, console logs, and unused imports. It includes individual commands for each of these tasks and a comprehensive command that combines all of them.

### Commands

1. **Remove Comments**

   - **Command:** `Remove Comments`
   - **Description:** Removes all single-line (`//`) and multi-line (`/* */`) comments from the active file, making your code more concise and easier to read.

2. **Remove Console Logs**

   - **Command:** `Remove Consols`
   - **Description:** Removes all consols `(console.log, console.error, console.info ...)` statements from the active file, ensuring that no debug logs are left in your production code.

3. **Remove Unused Imports**

   - **Command:** `Remove Unused Imports`
   - **Description:** Analyzes the active file to identify and remove any unused import statements, keeping your codebase clean and efficient.

4. **Clean Code**
   - **Command:** `Clean Code`
   - **Description:** Combines the functionality of removing comments, console logs, and unused imports into a single command, providing a one-stop solution for cleaning up your code.

## Usage

1. Open a JavaScript or TypeScript file in VSCode.
2. Run your command from the command palette by pressing (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Type one of the following commands and press Enter:
   - `Remove Comments`
   - `Remove Console Logs`
   - `Remove Unused Imports`
   - `Clean Code`

## Example

Here is an example JavaScript file before and after using the extension:

**Before 👎🤦‍♂️**

```typescript
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useReducer, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
} from "@radix-ui/react-icons"; */

export default function HomePage() {
  console.info("This is a console info");
  const [state, setState] = useState(0);

  console.log("This is a console log");
  useEffect(() => {}, []);
  console.error("This is a console error ");

  return (
    <main className="w-full h-full">
      This is a Next.js project that uses `Clean Code` extension.
      <Image src="/logo.png" alt="logo" width={200} height={200} />
      <Button></Button>
      {/* <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul> */}
    </main>
  );
}
```

**After ✨🙆‍♂️**

```typescript
import Image from "next/image";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [state, setState] = useState(0);

  useEffect(() => {}, []);

  return (
    <main className="w-full h-full">
      This is a Next.js project that uses `Clean Code` extension.
      <Image src="/logo.png" alt="logo" width={200} height={200} />
      <Button></Button>
    </main>
  );
}
```
