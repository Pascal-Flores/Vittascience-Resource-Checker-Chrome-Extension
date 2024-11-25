export type Report = {
    name                : string,
    link                : string,
    author              : string,
    deadImages          : DeadImage[],
    deadEmbedEditors    : DeadEmbedEditor[] 
}

export type DeadImage = {
    parentSection       : string,
    title               : string,
    src                 : string 
}

export type DeadEmbedEditor = {
    parentSection       : string,
    link                : string
}

