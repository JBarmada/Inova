import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { items } from "../../shared/catalog";
import { MemoryShelf } from "./MemoryShelf";
import { DogSprite } from "../companion/DogSprite";

export function WorldPanel() {
  const state = useInova();
  const [showShelf, setShowShelf] = useState(false);
  const { run, busy, message } = useAction();
  return <section><p className="eyebrow">A WORLD THAT GROWS WITH YOU</p><h2>Little things, earned together.</h2>
    <DogSprite state={state} />
    <div className="wardrobe">{items.map((item) => <article key={item.id}><h3>{item.name}</h3><p>{item.description}</p>
      <button disabled={busy || !state.ownedItems.includes(item.id)} onClick={() => void run(() => dispatch({ type: "equip", item: item.id }), `${item.name} equipped.`)}>
        {state.equippedItem === item.id ? "Equipped" : state.ownedItems.includes(item.id) ? "Equip" : "Locked"}</button></article>)}
      <button disabled={busy} onClick={() => void run(() => dispatch({ type: "equip", item: null }), "Item removed.")}>Remove item</button></div>
    {message && <p role="status">{message}</p>}
    <button className="primary" onClick={() => void run(async () => { setShowShelf(!showShelf); }, "Bookshelf toggled.")}>{showShelf ? "Close bookshelf" : "Open memory bookshelf"}</button>
    {showShelf && <MemoryShelf />}
  </section>;
}
