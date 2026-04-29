---
name: todo-manager
description: manage local coding-project todo files that use markdown task checkboxes in TODO.md, TODOS.md, todo.md, or todos.md, usually at a project root. use this skill when a user asks a coding agent to list all todos, list remaining or outstanding todos, list completed todos, add a todo, update todo text, mark a todo complete with [x], reopen a completed todo with [ ], or delete a todo from a project todo file. this is instructions-only and requires no bundled script.
---

# Todo Manager

## Core behavior

Manage markdown checkbox todos directly by reading and editing the project todo file. Do not require a helper script. Prefer direct file edits using the coding agent's normal filesystem tools.

## Locate the todo file

1. Use the user-provided todo file path if one is given.
2. Otherwise check the project root for these exact filenames, in order:
   - `TODO.md`
   - `TODOS.md`
   - `todo.md`
   - `todos.md`
3. If multiple todo files exist and the user did not specify one, use the first file in the order above and mention which file was used.
4. If no todo file exists and the user asks to add a todo, create `TODO.md` with a `# TODO` heading.
5. If no todo file exists and the user asks to list, complete, reopen, update, or delete todos, say no todo file was found and name the supported filenames.

## Todo syntax

- Remaining todo: `- [ ] todo text`
- Completed todo: `- [x] todo text`
- Treat `- [X] todo text` as completed, but normalize to lowercase `x` when editing that line.
- Preserve headings, blank lines, comments, ordering, indentation, and unrelated content.
- Preserve the todo text exactly unless the user asked to change it.

## Supported operations

### List todos

For "list todos" or "show todos", parse every markdown checkbox item in the selected todo file.

- `all`: include remaining and completed todos.
- `remaining`, `outstanding`, `open`, or `incomplete`: include only `- [ ]` todos.
- `completed`, `complete`, or `done`: include only `- [x]` or `- [X]` todos.

Display todos with stable numeric indexes based on their order in the file, plus status:

```text
1. [x] send emails
2. [ ] newsletter
```

When useful, include counts: total, remaining, completed.

### Add a todo

Append a new unchecked item using this format:

```markdown
- [ ] new todo text
```

Append it after the last existing todo item. If the file has a `# TODO` heading but no existing items, add it under the heading. Ensure the file ends with a newline.

### Complete a todo

Find the target todo and change only its checkbox marker to `[x]`.

Before:

```markdown
- [ ] newsletter
```

After:

```markdown
- [x] newsletter
```

### Reopen a todo

Find the target todo and change only its checkbox marker to `[ ]`.

Before:

```markdown
- [x] newsletter
```

After:

```markdown
- [ ] newsletter
```

### Update todo text

Find the target todo and replace only the text after the checkbox. Preserve the original checkbox status and indentation.

Before:

```markdown
- [ ] newsletter
```

After:

```markdown
- [ ] newsletter landing page copy
```

### Delete a todo

Remove the entire todo line. Do not remove headings or neighboring blank lines unless the user explicitly asks for cleanup.

## Matching rules

When the user identifies a todo by number, use the list index from the current file order.

When the user identifies a todo by text:

1. Prefer exact case-insensitive match of the todo text.
2. If no exact match exists, allow a clear substring match.
3. If multiple todos match, do not guess. Show the matching todos with indexes and ask the user which one to modify.
4. If no todo matches, say so and offer to list todos.

For destructive operations such as delete, be extra careful with ambiguous text matches. Do not delete multiple matching todos unless the user explicitly asks to delete all matches.

## Response format

After a read-only list operation, show the requested todos and counts.

After a write operation, respond with:

- the file edited
- the action taken
- the exact todo changed, added, or deleted
- the remaining todo count when available

Keep responses concise.

## Examples

User: "list outstanding todos"

Agent: locate `TODO.md`/`TODOS.md`/`todo.md`/`todos.md`, parse unchecked items, and show only `- [ ]` todos.

User: "complete newsletter"

Agent: find the matching todo, change `- [ ] newsletter` to `- [x] newsletter`, preserve the rest of the file, and report the change.

User: "reopen 3"

Agent: use the third checkbox todo in file order and change its marker to `[ ]`.

User: "delete add todos skill"

Agent: remove only the matching todo line. If several lines match, ask for an index instead of guessing.
