import {ParticleUtils, EaseSegment, SimpleEase, Color} from "./ParticleUtils";
import {BasicTweenable} from "./EmitterConfig";

export interface ValueStep<T> {
	value:T;
	time:number;
	viriance:T;
}

export interface ValueList<T> {
	list: ValueStep<T>[],
	isStepped?: boolean;
	ease?: SimpleEase|EaseSegment[];
}
/**
 * A single node in a PropertyList.
 */
export class PropertyNode<V>
{
	/**
	 * Value for the node.
	 */
	public value: V;

	public originValue: V;
	/**
	 * Time value for the node. Between 0-1.
	 */
	public time: number;
	/**
	 * Time viriation value for the node.
	 */
	public viriance: V;
	/**
	 * The next node in line.
	 */
	public next: PropertyNode<V>;
	/**
	 * If this is the first node in the list, controls if the entire list is stepped or not.
	 */
	public isStepped: boolean;
	public ease: SimpleEase;
	
	/**
	 * @param value The value for this node
	 * @param time The time for this node, between 0-1
	 * @param [ease] Custom ease for this list. Only relevant for the first node.
	 */
	constructor(value: V, time:number, ease?: SimpleEase|EaseSegment[])
	{
		this.value = value;
		this.originValue = value;
		this.time = time;
		this.viriance = null;
		this.next = null;
		this.isStepped = false;
		if (ease)
		{
			this.ease = typeof ease == "function" ? ease : ParticleUtils.generateEase(ease);
		}
		else
		{
			this.ease = null;
		}
	}

	/**
	 * Creates a list of property values from a data object {list, isStepped} with a list of objects in
	 * the form {value, time}. Alternatively, the data object can be in the deprecated form of
	 * {start, end}.
	 * @param data The data for the list.
	 * @param data.list The array of value and time objects.
	 * @param data.isStepped If the list is stepped rather than interpolated.
	 * @param data.ease Custom ease for this list.
	 * @return The first node in the list
	 */
	public static createList<T extends (string|number)>(data: ValueList<T>|BasicTweenable<T>):PropertyNode<T extends string ? Color : T>
	{
		if ("list" in data)
		{
			let array = data.list;
			let node, first;
			const {value, time, viriance} = array[0];
			first = node = new PropertyNode(typeof value === 'string' ? ParticleUtils.hexToRGB(value) : value, time, data.ease);
			if(viriance){
				first.viriance = node.viriance = typeof viriance === 'string' ? ParticleUtils.hexToRGB(String(viriance)) : viriance as any;
			}
			//only set up subsequent nodes if there are a bunch or the 2nd one is different from the first
			if (array.length > 2 || (array.length === 2 && array[1].value !== value))
			{
				for (let i = 1; i < array.length; ++i)
				{
					const {value, time, viriance} = array[i];
					node.next = new PropertyNode(typeof value === 'string' ? ParticleUtils.hexToRGB(value) : value, time);
					node = node.next;
					node.viriance = typeof viriance === 'string' ? ParticleUtils.hexToRGB(String(viriance)) : viriance as any;
				}
			}
			first.isStepped = !!data.isStepped;
			return first as PropertyNode<T extends string ? Color : T>;
		}
		else
		{
			//Handle deprecated version here
			let start = new PropertyNode(typeof data.start === 'string' ? ParticleUtils.hexToRGB(data.start) : data.start, 0);
			start.viriance = typeof data.viriance === 'string' ? ParticleUtils.hexToRGB(String(data.viriance)) : data.viriance as any;
			//only set up a next value if it is different from the starting value
			if (data.end !== data.start)
				start.next = new PropertyNode(typeof data.end === 'string' ? ParticleUtils.hexToRGB(data.end) : data.end, 1);
				start.viriance = typeof data.viriance === 'string' ? ParticleUtils.hexToRGB(String(data.viriance)) : data.viriance as any;
			return start as PropertyNode<T extends string ? Color : T>;
		}
	}

	public caculateVariance(){
		if(typeof this.value == "number" && this.viriance){
			this.value =  Number(this.originValue) +((Math.random() * (1 - (-1)) + -1))*Number(this.viriance) as any;
		}else{
			if(typeof this.value == "object" && this.viriance){
				(this.value as unknown as Color).a = (this.originValue as unknown as Color).a + ((Math.random() * (1 - (-1)) + -1))*(this.viriance as unknown as Color).a;
				(this.value as unknown as Color).r = (this.originValue as unknown as Color).r + ((Math.random() * (1 - (-1)) + -1))*(this.viriance as unknown as Color).r;
				(this.value as unknown as Color).g = (this.originValue as unknown as Color).g + ((Math.random() * (1 - (-1)) + -1))*(this.viriance as unknown as Color).g;
				(this.value as unknown as Color).b = (this.originValue as unknown as Color).b + ((Math.random() * (1 - (-1)) + -1))*(this.viriance as unknown as Color).b;
			}

		}
	}
}