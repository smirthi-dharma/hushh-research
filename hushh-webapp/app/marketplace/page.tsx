{!loading && activeCards.length === 0 ? (
  <RiaSurface className="col-span-full p-6 text-center">
    <h3 className="text-lg font-semibold tracking-tight text-foreground">
      No matching profiles found
    </h3>

    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
      We couldn&apos;t find any {directoryKind === "rias" ? "advisors" : "investors"} matching your current search. Try clearing the search or restarting the discovery deck.
    </p>

    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {query ? (
        <Button
          variant="none"
          effect="fade"
          size="sm"
          onClick={() => setQuery("")}
        >
          Clear search
        </Button>
      ) : null}

      <Button
        variant="blue-gradient"
        effect="fill"
        size="sm"
        onClick={resetSwipeDeck}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset deck
      </Button>

      <Button
        variant="none"
        effect="fade"
        size="sm"
        onClick={() => setView("swipe")}
      >
        Switch to swipe view
      </Button>
    </div>
  </RiaSurface>
) : null}