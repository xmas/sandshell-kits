# Sandshell kits

[sbx](https://docs.docker.com/ai/sandboxes/) kits that [Sandshell](https://github.com/xmas/homebrew-xmas) adds to its sandboxes. They are ordinary mixin kits, so any sbx client can use them, locally or in Docker Cloud Sandboxes.

| Kit | For | What it does |
|---|---|---|
| `sandshell-claude` | `claude` sandboxes | The ACP adapter Sandshell's native Claude chats run ([`@agentclientprotocol/claude-agent-acp`](https://www.npmjs.com/package/@agentclientprotocol/claude-agent-acp)) with its own Node, built in under `/opt/sandshell`, plus a small wrapper that adds undoing a turn's file edits and MCP server status/reconnect to it. Entry point: `/opt/sandshell/bin/sandshell-claude-acp`. |
| `sandshell-codex` | `codex` sandboxes | [`@agentclientprotocol/codex-acp`](https://www.npmjs.com/package/@agentclientprotocol/codex-acp) with its own Node, built in under `/opt/sandshell`. Entry point: `/opt/sandshell/bin/sandshell-codex-acp`. |

They're v3 kits (sbx 0.51 or later): a `spec.yaml` and a `Dockerfile` that sbx builds into the kit's image. A source kit builds in sbx's builder sandbox when `SBX_KIT_BUILDER=sandbox` is set (otherwise sbx uses the host's Docker buildx, whose default builder can't export a kit image).

## Use

```bash
SBX_KIT_BUILDER=sandbox sbx create claude . --kit 'git+https://github.com/xmas/sandshell-kits.git#ref=v0.2.54&dir=sandshell-claude'
```

Or add it to a running sandbox: `sbx kit add <sandbox> 'git+https://github.com/xmas/sandshell-kits.git#ref=v0.2.54&dir=sandshell-claude'`.

## The wrapper

`sandshell-claude/scripts/sandshell-acp.mjs` runs the adapter unchanged. It answers three extra requests, which it carries on the adapter's own `_session/async_task/stop` method (an `asyncTaskId` of `sandshell:<base64url JSON>`; the reply's `_meta.sandshell` is the answer):

- `{"op":"rewind","uuid":…,"dryRun":…}`: Claude Code's `rewindFiles`, back to before a prompt.
- `{"op":"mcpStatus"}`, `{"op":"mcpReconnect","name":…}`, `{"op":"mcpToggle","name":…,"enabled":…}`: MCP server status, reconnect, on/off.

These kits are generated from the Sandshell repository; changes land there first.
