Class Tartessos.Quest.Translation.InscriptionQueries Extends %RegisteredObject
{
    // Use UNION ALL to combine results from multiple tables into a single result set. This allows for a comprehensive view of inscriptions across different source types.
    // To filter the results based on the source type, we use a parameterized query with a WHERE clause that checks the value of the :sourceType parameter. If the parameter is set to 'all', it will return inscriptions from all source types; otherwise, it will filter based on the specified source type.
    // The signature of the method should be:
    // Query InscriptionsBySource(sourceType As %String = "all") As %SQLQuery(CONTAINID = 0, ROWSPEC = "SourceType:%String,ChamberCode:%String,FloorLevel:%Integer,ObjectMaterial:%String,Classification:%String,Inscription:%String") [ SqlProc ]

}
