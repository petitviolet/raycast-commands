import { useState, useMemo } from "react";
import { showHUD, Clipboard, List, Action, ActionPanel } from "@raycast/api";
import dayjs from "dayjs";

export default () => {
  const [input, setInput] = useState("now");

  // const input = props.arguments.input;
  const forDate: dayjs.Dayjs | undefined = useMemo(() => {
    if (input === 'now') {
      return dayjs();
    }
    const date = dayjs(input)
    if (date.isValid()) {
      return date;
    }
    const unixtime = parseInt(input);
    if (isValidUnixTime(unixtime)) {
      return fromUnixTime(unixtime);
    }

    return;
  }, [input])

  const forUnixTime: dayjs.Dayjs | undefined = useMemo(() => {
    if (input === 'now') {
      return dayjs()
    }
    const date = dayjs(input)
    if (date.isValid()) {
      return date;
    }
    const _unixtime = parseInt(input)
    if (isValidUnixTime(_unixtime)) {
      return dayjs.unix(_unixtime)
    }

    return undefined;
  }, [input])

  const unixtimeStr = forUnixTime ? `${forUnixTime.unix()}` : '';
  const dateStrs: string[] = useMemo(() => {
    if (!forDate) return [];
    const _date = dayjs(forDate);
    return [
      _date.format("YYYY-MM-DD hh:mm:ss"),
      _date.format("YYYY-MM-DD hh:mm:ss Z"),
      _date.format("YYYY/MM/DD hh:mm:ss"),
      _date.format("YYYY/MM/DD hh:mm:ss Z"),
      _date.format("YYYYMMDD_hhmmss"),
      _date.format("YYYY-MM-DD"),
      _date.format("YYYYMMDD"),
      _date.format("hhmmss"),
      _date.format("hh:mm:ss"),
    ]
  }, [forDate])

  return (<List
    searchText={input}
    onSearchTextChange={setInput}>
    {[unixtimeStr, ...dateStrs].map((item) => {
      return (<List.Item key={item} title={item}
        actions={
          <ActionPanel>
            <Action title="Copy" onAction={async () => {
              await Clipboard.copy(item);
              await showHUD(`Copied ${item} to clipboard`);
            }} />
          </ActionPanel>
        }></List.Item>);
    })}
  </List>
  );
}

const toUnixTime = (date: dayjs.Dayjs): number => date.unix();
const fromUnixTime = (unixtime: number): dayjs.Dayjs => dayjs(new Date(unixtime * 1000));

const isValidUnixTime = (unixtime: number): boolean => !Number.isNaN(unixtime) && unixtime > 10000000
