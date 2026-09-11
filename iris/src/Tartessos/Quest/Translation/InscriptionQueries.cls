Class Tartessos.Quest.Translation.InscriptionQueries Extends %RegisteredObject
{

Query InscriptionsBySource(sourceType As %String = "all") As %SQLQuery(CONTAINID = 0, ROWSPEC = "SourceType:%String,ChamberCode:%String,FloorLevel:%Integer,ObjectMaterial:%String,Classification:%String,Inscription:%String") [ SqlProc ]
{
SELECT
    'sarcophagus' AS SourceType,
    M.Code AS ChamberCode,
    M.FloorLevel AS FloorLevel,
    S.Material AS ObjectMaterial,
    'sarcophagus' AS Classification,
    S.Inscriptions AS Inscription
FROM Tartessos_Quest_Finds.Sarcophagus AS S
INNER JOIN Tartessos_Quest_Chambers.Mortuary AS M
    ON S.Mortuary = M.ID
WHERE S.Inscriptions IS NOT NULL
AND S.Inscriptions <> ''
AND (:sourceType = 'all' OR :sourceType = 'sarcophagus')

UNION ALL

SELECT
    'offering' AS SourceType,
    M.Code AS ChamberCode,
    M.FloorLevel AS FloorLevel,
    O.Material AS ObjectMaterial,
    O.Classification AS Classification,
    O.Inscription AS Inscription
FROM Tartessos_Quest_Finds.Offering AS O
INNER JOIN Tartessos_Quest_Finds.Sarcophagus AS S
    ON O.Sarcophagus = S.ID
INNER JOIN Tartessos_Quest_Chambers.Mortuary AS M
    ON S.Mortuary = M.ID
WHERE O.Inscription IS NOT NULL
AND O.Inscription <> ''
AND (:sourceType = 'all' OR :sourceType = 'offering')
}

}
