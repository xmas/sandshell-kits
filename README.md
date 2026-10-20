# Sandshell kits

[sbx](https://docs.docker.com/ai/sandboxes/) kits that [Sandshell](https://github.com/xmas/homebrew-xmas) adds to its sandboxes. They are ordinary mixin kits, so any sbx client can use them, locally or in Docker Cloud Sandboxes.

| Kit | For | What it does |
|---|---|---|
| `sandshell-claude` | `claude` sandboxes | Preinstalls the ACP adapter Sandshell's native Claude chats run ([`@agentclientprotocol/claude-agent-acp`](https://www.npmjs.com/package/@agentclientprotocol/claude-agent-acp)), plus a small wrapper that adds undoing a turn's file edits and MCP server status/reconnect to it. |
| `sandshell-codex` | `codex` sandboxes | Preinstalls [`@agentclientprotocol/codex-acp`](https://www.npmjs.com/package/@agentclientprotocol/codex-acp), and writes the placeholder sign-in file `sbx run codex` writes, so Codex signs in through sbx's credential proxy when it's started some other way. |

## Use

```bash
sbx create claude . --kit 'git+https://github.com/xmas/sandshell-kits.git#ref=v0.2.36&dir=sandshell-claude'
```

Or add it to a running sandbox: `sbx kit add <sandbox> 'git+https://github.com/xmas/sandshell-kits.git#ref=v0.2.36&dir=sandshell-claude'`.

## The wrapper

`sandshell-claude/files/home/.sandshell/acp/<adapter version>/sandshell-acp.mjs` runs the adapter unchanged. It answers three extra requests, which it carries on the adapter's own `_session/async_task/stop` method (an `asyncTaskId` of `sandshell:<base64url JSON>`; the reply's `_meta.sandshell` is the answer):

- `{"op":"rewind","uuid":…,"dryRun":…}`: Claude Code's `rewindFiles`, back to before a prompt.
- `{"op":"mcpStatus"}`, `{"op":"mcpReconnect","name":…}`, `{"op":"mcpToggle","name":…,"enabled":…}`: MCP server status, reconnect, on/off.

These kits are generated from the Sandshell repository; changes land there first.
