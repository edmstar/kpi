class ConsolidateService
{
    constructor(app)
    {
        this.app = app;
    }

    consolidate(kpi, start, end, callback)
    {
        if (kpi === null)
            return;

        var calculate = function(values)
        {
            var result = 0.0;
            switch(kpi.method.toLowerCase())
            {
                case 'mean':
                    result = this.calculateMean(values);
                    break;
                case 'weighted':
                    result = this.calculateWeighted(values);
                    break;
                case 'sum':
                    result = this.calculateSum(values);
                    break;
                case 'min':
                    result = this.calculateMin(values);
                    break;
                case 'max':
                    result = this.calculateMax(values);
                    break;
            }
            callback(result);
        }

        kpi.getValues(start, end, calculate);
    }

    calculateMean(values, count)
    {
        if (values === undefined || values.length === 0)
            return 0.0;

        if (count === undefined)
            count = values.length;

        if (count === 0)
            return 0.0;

        return this.calculateSum(values) / count;
    }

    calculateWeighted(values)
    {
        if (value === undefined || values.length === 0)
            return 0.0;

        var sum = 0.0;
        var sumWeights = 0.0;

        values.foreach(kpivalue =>
        { 
            sum += kpivalue.value*kpivalue.weight;
            sumWeights += kpivalue.weight;
        });

        return sum / sumWeights;
    }

    calculateSum(values)
    {
        var sum = 0.0;
        values.foreach(kpivalue => { sum += kpivalue.value; });

        return sum;
    }

    calculateMin(values)
    {

    }

    calculateMax(values)
    {

    }

    getElementsInPeriod(kpi, start, end)
    {
        if (kpi.)
    }
}